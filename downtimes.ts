import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiOptions, Fetcher } from "./fetcher.ts";

assertType<Extends<Downtime, CreateDowntimeInput>>(true);

export type Downtime = {
  id: string;
  name: string;
  memo: string;
  start: Date;
  durationMinutes: number;
  recurrence: DowntimeRecurrence | undefined;
  scopes: DowntimeScopes;
};

export type DowntimeRecurrence =
  | CommonDowntimeReccurence
  | WeeklyDowntimeReccurence;

export type BaseDowntimeRecurrence = {
  interval: number;
  until: Date | undefined;
};

export type CommonDowntimeReccurence =
  & BaseDowntimeRecurrence
  & Readonly<{
    type: "hourly" | "daily" | "monthly" | "yearly";
  }>;

export type WeeklyDowntimeReccurence =
  & BaseDowntimeRecurrence
  & Readonly<{
    type: "weekly";
    weekdays: DowntimeRecurrenceWeekday[];
  }>;

export type DowntimeRecurrenceType = DowntimeRecurrence["type"];

export type DowntimeRecurrenceWeekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type DowntimeScopes = {
  services: {
    /** included service names */
    include: string[];
    /** excluded service names */
    exclude: string[];
  };
  roles: {
    /** included role fullnames */
    include: string[];
    /** excluded role fullnames */
    exclude: string[];
  };
  monitors: {
    /** included monitor ids */
    include: string[];
    /** excluded monitor ids */
    exclude: string[];
  };
};

export type CreateDowntimeInput = Readonly<{
  name: string;
  memo?: string | undefined;
  start: Date;
  durationMinutes: number;
  recurrence?: CreateDowntimeInputRecurrence | undefined;
  scopes?: CreateDowntimeInputScopes | undefined;
}>;

export type CreateDowntimeInputRecurrence =
  | CommonCreateDowntimeInputRecurrence
  | WeeklyCreateDowntimeInputRecurrence;

export type BaseCreateDowntimeInputRecurrence = Readonly<{
  interval: number;
  until?: Date | undefined;
}>;

export type CommonCreateDowntimeInputRecurrence =
  & BaseCreateDowntimeInputRecurrence
  & Readonly<{
    type: "hourly" | "daily" | "monthly" | "yearly";
  }>;

export type WeeklyCreateDowntimeInputRecurrence =
  & BaseCreateDowntimeInputRecurrence
  & Readonly<{
    type: "weekly";
    weekdays?: readonly DowntimeRecurrenceWeekday[] | undefined;
  }>;

export type CreateDowntimeInputScopes = Readonly<{
  services?: Readonly<{
    /** included service names */
    include?: readonly string[] | undefined;
    /** excluded service names */
    exclude?: readonly string[] | undefined;
  }>;
  roles?: Readonly<{
    /** included role fullnames */
    include?: readonly string[] | undefined;
    /** excluded role fullnames */
    exclude?: readonly string[] | undefined;
  }>;
  monitors?: Readonly<{
    /** included monitor ids */
    include?: readonly string[] | undefined;
    /** excluded monitor ids */
    exclude?: readonly string[] | undefined;
  }>;
}>;

export class DowntimesApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async list(options?: ApiOptions): Promise<Downtime[]> {
    const res = await this.fetcher.fetch<{ downtimes: RawDowntime[] }>(
      "GET",
      "/api/v0/downtimes",
      { signal: options?.signal },
    );
    return res.downtimes.map((downtime) => fromRawDowntime(downtime));
  }

  async create(
    input: CreateDowntimeInput,
    options?: ApiOptions,
  ): Promise<Downtime> {
    const res = await this.fetcher.fetch<RawDowntime, RawCreateDowntimeInput>(
      "POST",
      "/api/v0/downtimes",
      {
        body: toRawCreateDowntimeInput(input),
        signal: options?.signal,
      },
    );
    return fromRawDowntime(res);
  }

  async update(
    downtimeId: string,
    input: CreateDowntimeInput,
    options?: ApiOptions,
  ): Promise<Downtime> {
    const res = await this.fetcher.fetch<RawDowntime, RawCreateDowntimeInput>(
      "PUT",
      `/api/v0/downtimes/${downtimeId}`,
      {
        body: toRawCreateDowntimeInput(input),
        signal: options?.signal,
      },
    );
    return fromRawDowntime(res);
  }

  async delete(
    downtimeId: string,
    options?: ApiOptions,
  ): Promise<Downtime> {
    const res = await this.fetcher.fetch<RawDowntime>(
      "DELETE",
      `/api/v0/downtimes/${downtimeId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawDowntime(res);
  }
}

type RawDowntime = {
  id: string;
  name: string;
  memo?: string | null | undefined;
  start: number;
  duration: number;
  recurrence?: RawDowntimeRecurrence | null | undefined;
  serviceScopes?: string[] | null | undefined;
  serviceExcludeScopes?: string[] | null | undefined;
  roleScopes?: string[] | null | undefined;
  roleExcludeScopes?: string[] | null | undefined;
  monitorScopes?: string[] | null | undefined;
  monitorExcludeScopes?: string[] | null | undefined;
};

type RawDowntimeRecurrence =
  | RawCommonDowntimeReccurence
  | RawWeeklyDowntimeReccurence;

type RawBaseDowntimeRecurrence = {
  interval: number;
  until?: number | null | undefined;
};

type RawCommonDowntimeReccurence =
  & RawBaseDowntimeRecurrence
  & Readonly<{
    type: "hourly" | "daily" | "monthly" | "yearly";
  }>;

type RawWeeklyDowntimeReccurence =
  & RawBaseDowntimeRecurrence
  & Readonly<{
    type: "weekly";
    weekdays?: DowntimeRecurrenceWeekday[] | null | undefined;
  }>;

function fromRawDowntime(raw: RawDowntime): Downtime {
  return {
    id: raw.id,
    name: raw.name,
    memo: raw.memo ?? "",
    start: new Date(raw.start * 1000),
    durationMinutes: raw.duration,
    recurrence: raw.recurrence
      ? ((recurrence: RawDowntimeRecurrence): DowntimeRecurrence => {
        const base: BaseDowntimeRecurrence = {
          interval: recurrence.interval,
          until: typeof recurrence.until === "number"
            ? new Date(recurrence.until * 1000)
            : undefined,
        };
        switch (recurrence.type) {
          case "weekly":
            return {
              ...base,
              type: recurrence.type,
              weekdays: recurrence.weekdays ?? [],
            };
          case "hourly":
          case "daily":
          case "monthly":
          case "yearly":
            return {
              ...base,
              type: recurrence.type,
            };
          default: {
            // deno-lint-ignore no-explicit-any
            const type = (recurrence satisfies never as any)?.type;
            throw new Error(`Unknown recurrence type: ${type}`, { cause: raw });
          }
        }
      })(raw.recurrence)
      : undefined,
    scopes: {
      services: {
        include: raw.serviceScopes ?? [],
        exclude: raw.serviceExcludeScopes ?? [],
      },
      roles: {
        include: raw.roleScopes ?? [],
        exclude: raw.roleExcludeScopes ?? [],
      },
      monitors: {
        include: raw.monitorScopes ?? [],
        exclude: raw.monitorExcludeScopes ?? [],
      },
    },
  };
}

type RawCreateDowntimeInput = Readonly<{
  name: string;
  memo?: string | undefined;
  start: number;
  duration: number;
  recurrence?: RawCreateDowntimeInputRecurrence | undefined;
  serviceScopes?: readonly string[] | undefined;
  serviceExcludeScopes?: readonly string[] | undefined;
  roleScopes?: readonly string[] | undefined;
  roleExcludeScopes?: readonly string[] | undefined;
  monitorScopes?: readonly string[] | undefined;
  monitorExcludeScopes?: readonly string[] | undefined;
}>;

type RawCreateDowntimeInputRecurrence =
  | RawCommonCreateDowntimeInputRecurrence
  | RawWeeklyCreateDowntimeInputRecurrence;

type RawBaseCreateDowntimeInputRecurrence = Readonly<{
  interval: number;
  until?: number | undefined;
}>;

type RawCommonCreateDowntimeInputRecurrence =
  & RawBaseCreateDowntimeInputRecurrence
  & Readonly<{
    type: "hourly" | "daily" | "monthly" | "yearly";
  }>;

type RawWeeklyCreateDowntimeInputRecurrence =
  & RawBaseCreateDowntimeInputRecurrence
  & Readonly<{
    type: "weekly";
    weekdays?: readonly DowntimeRecurrenceWeekday[] | undefined;
  }>;

function toRawCreateDowntimeInput(
  input: CreateDowntimeInput,
): RawCreateDowntimeInput {
  return {
    name: input.name,
    memo: input.memo,
    start: Math.floor(input.start.getTime() / 1000),
    duration: input.durationMinutes,
    recurrence: input.recurrence
      ? ((
        recurrence: CreateDowntimeInputRecurrence,
      ): RawCreateDowntimeInputRecurrence => {
        const base = {
          interval: recurrence.interval,
          until: recurrence.until ? Math.floor(recurrence.until.getTime() / 1000) : undefined,
        };
        switch (recurrence.type) {
          case "weekly":
            return {
              ...base,
              type: recurrence.type,
              weekdays: recurrence.weekdays,
            };
          case "hourly":
          case "daily":
          case "monthly":
          case "yearly":
            return {
              ...base,
              type: recurrence.type,
            };
          default: {
            // deno-lint-ignore no-explicit-any
            const type = (recurrence satisfies never as any)?.type;
            throw new Error(`Unknown recurrence type: ${type}`, { cause: input });
          }
        }
      })(input.recurrence)
      : undefined,
    serviceScopes: input.scopes?.services?.include,
    serviceExcludeScopes: input.scopes?.services?.exclude,
    roleScopes: input.scopes?.roles?.include,
    roleExcludeScopes: input.scopes?.roles?.exclude,
    monitorScopes: input.scopes?.monitors?.include,
    monitorExcludeScopes: input.scopes?.monitors?.exclude,
  };
}
