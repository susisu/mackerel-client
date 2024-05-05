import type { ApiClient, ApiOptions } from "./api.ts";

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

type BaseDowntimeRecurrence = {
  interval: number;
  until: Date | undefined;
};

type CommonDowntimeReccurence =
  & BaseDowntimeRecurrence
  & Readonly<{
    type: "hourly" | "daily" | "monthly" | "yearly";
  }>;

type WeeklyDowntimeReccurence =
  & BaseDowntimeRecurrence
  & Readonly<{
    type: "weekly";
    weekdays: DowntimeRecurrenceWeekday[] | undefined;
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
    include: string[] | undefined;
    exclude: string[] | undefined;
  };
  roles: {
    include: string[] | undefined;
    exclude: string[] | undefined;
  };
  monitors: {
    include: string[] | undefined;
    exclude: string[] | undefined;
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

type BaseCreateDowntimeInputRecurrence = Readonly<{
  interval: number;
  until?: Date | undefined;
}>;

type CommonCreateDowntimeInputRecurrence =
  & BaseCreateDowntimeInputRecurrence
  & Readonly<{
    type: "hourly" | "daily" | "monthly" | "yearly";
  }>;

type WeeklyCreateDowntimeInputRecurrence =
  & BaseCreateDowntimeInputRecurrence
  & Readonly<{
    type: "weekly";
    weekdays?: readonly DowntimeRecurrenceWeekday[] | undefined;
  }>;

export type CreateDowntimeInputScopes = Readonly<{
  services?: Readonly<{
    include?: readonly string[] | undefined;
    exclude?: readonly string[] | undefined;
  }>;
  roles?: Readonly<{
    include?: readonly string[] | undefined;
    exclude?: readonly string[] | undefined;
  }>;
  monitors?: Readonly<{
    include?: readonly string[] | undefined;
    exclude?: readonly string[] | undefined;
  }>;
}>;

export class DowntimesApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(options?: ApiOptions): Promise<Downtime[]> {
    const res = await this.api.fetch<{ downtimes: RawDowntime[] }>(
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
    const res = await this.api.fetch<RawDowntime, RawCreateDowntimeInput>(
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
    const res = await this.api.fetch<RawDowntime, RawCreateDowntimeInput>(
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
    const res = await this.api.fetch<RawDowntime>(
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
              weekdays: recurrence.weekdays ?? undefined,
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
            const type = (recurrence satisfies never as any).type;
            throw new Error(`Unknown recurrence type: ${type}`, { cause: raw });
          }
        }
      })(raw.recurrence)
      : undefined,
    scopes: {
      services: {
        include: raw.serviceScopes ?? undefined,
        exclude: raw.serviceExcludeScopes ?? undefined,
      },
      roles: {
        include: raw.roleScopes ?? undefined,
        exclude: raw.roleExcludeScopes ?? undefined,
      },
      monitors: {
        include: raw.monitorScopes ?? undefined,
        exclude: raw.monitorExcludeScopes ?? undefined,
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
            const type = (recurrence satisfies never as any).type;
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
