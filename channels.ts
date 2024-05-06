import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiClient, ApiOptions } from "./api.ts";

assertType<Extends<Extract<Channel, { type: CreateChannelInput["type"] }>, CreateChannelInput>>(
  true,
);

export type Channel = CommonChannel | EmailChannel | SlackChannel | WebhookChannel;

type BaseChannel = {
  id: string;
  name: string;
  suspendedAt: Date | undefined;
};

export type CommonChannel = BaseChannel & {
  type:
    | "line"
    | "chatwork"
    | "typetalk"
    | "twilio"
    | "pagerduty"
    | "opsgenie"
    | "microsoft-teams"
    | "amazon-event-bridge";
};

export type EmailChannel = BaseChannel & {
  type: "email";
  emails: string[] | undefined;
  userIds: string[] | undefined;
  events: ChannelEvent[];
};

export type SlackChannel = BaseChannel & {
  type: "slack";
  url: string;
  mentions: {
    ok: string | undefined;
    warning: string | undefined;
    critical: string | undefined;
  };
  includeGraphImages: boolean;
  events: ChannelEvent[];
};

export type WebhookChannel = BaseChannel & {
  type: "webhook";
  url: string;
  includeGraphImages: boolean;
  events: ChannelEvent[];
};

export type ChannelEvent =
  | "alert"
  | "alertGroup"
  | "hostStatus"
  | "hostRegister"
  | "hostRetire"
  | "monitor";

export type CreateChannelInput =
  | CreateEmailChannelInput
  | CreateSlackChannelInput
  | CreateWebhookChannelInput;

type BaseCreateChannelInput = Readonly<{
  name: string;
}>;

export type CreateEmailChannelInput =
  & BaseCreateChannelInput
  & Readonly<{
    type: "email";
    emails?: readonly string[] | undefined;
    userIds?: readonly string[] | undefined;
    events?: readonly ChannelEvent[] | undefined;
  }>;

export type CreateSlackChannelInput =
  & BaseCreateChannelInput
  & Readonly<{
    type: "slack";
    url: string | URL;
    mentions?:
      | Readonly<{
        ok?: string | undefined;
        warning?: string | undefined;
        critical?: string | undefined;
      }>
      | undefined;
    includeGraphImages?: boolean | undefined;
    events?: readonly ChannelEvent[] | undefined;
  }>;

export type CreateWebhookChannelInput =
  & BaseCreateChannelInput
  & Readonly<{
    type: "webhook";
    url: string | URL;
    includeGraphImages?: boolean | undefined;
    events?: readonly ChannelEvent[] | undefined;
  }>;

export class ChannelsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(options?: ApiOptions): Promise<Channel[]> {
    const res = await this.api.fetch<{ channels: RawChannel[] }>(
      "GET",
      "/api/v0/channels",
      { signal: options?.signal },
    );
    return res.channels.map((channel) => fromRawChannel(channel));
  }

  async create(input: CreateChannelInput, options?: ApiOptions): Promise<Channel> {
    const res = await this.api.fetch<RawChannel, RawCreateChannelInput>(
      "POST",
      "/api/v0/channels",
      {
        body: toRawCreateChannelInput(input),
        signal: options?.signal,
      },
    );
    return fromRawChannel(res);
  }

  async delete(channelId: string, options?: ApiOptions): Promise<Channel> {
    const res = await this.api.fetch<RawChannel>(
      "DELETE",
      `/api/v0/channels/${channelId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawChannel(res);
  }
}

type RawChannel = RawCommonChannel | RawEmailChannel | RawSlackChannel | RawWebhookChannel;

type RawBaseChannel = {
  id: string;
  name: string;
  suspendedAt?: number | null | undefined;
};

type RawCommonChannel = RawBaseChannel & {
  type:
    | "line"
    | "chatwork"
    | "typetalk"
    | "twilio"
    | "pagerduty"
    | "opsgenie"
    | "microsoft-teams"
    | "amazon-event-bridge";
};

type RawEmailChannel = RawBaseChannel & {
  type: "email";
  emails?: string[] | null | undefined;
  userIds?: string[] | null | undefined;
  events: ChannelEvent[];
};

type RawSlackChannel = RawBaseChannel & {
  type: "slack";
  url: string;
  mentions: {
    ok?: string | null | undefined;
    warning?: string | null | undefined;
    critical?: string | null | undefined;
  };
  enabledGraphImage: boolean;
  events: ChannelEvent[];
};

type RawWebhookChannel = RawBaseChannel & {
  type: "webhook";
  url: string;
  enabledGraphImage: boolean;
  events: ChannelEvent[];
};

function fromRawChannel(raw: RawChannel): Channel {
  const base: BaseChannel = {
    id: raw.id,
    name: raw.name,
    suspendedAt: typeof raw.suspendedAt === "number" ? new Date(raw.suspendedAt * 1000) : undefined,
  };
  switch (raw.type) {
    case "email":
      return {
        ...base,
        type: "email",
        emails: raw.emails ?? undefined,
        userIds: raw.userIds ?? undefined,
        events: raw.events,
      };
    case "slack":
      return {
        ...base,
        type: "slack",
        url: raw.url,
        mentions: {
          ok: raw.mentions.ok ?? undefined,
          warning: raw.mentions.warning ?? undefined,
          critical: raw.mentions.critical ?? undefined,
        },
        includeGraphImages: raw.enabledGraphImage,
        events: raw.events,
      };
    case "webhook":
      return {
        ...base,
        type: "webhook",
        url: raw.url,
        includeGraphImages: raw.enabledGraphImage,
        events: raw.events,
      };
    case "line":
    case "chatwork":
    case "typetalk":
    case "twilio":
    case "pagerduty":
    case "opsgenie":
    case "microsoft-teams":
    case "amazon-event-bridge":
      return {
        ...base,
        type: raw.type,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (raw satisfies never as any).type;
      throw new Error(`Unknown channel type: ${type}`, { cause: raw });
    }
  }
}

type RawCreateChannelInput =
  | RawCreateEmailChannelInput
  | RawCreateSlackChannelInput
  | RawCreateWebhookChannelInput;

type RawBaseCreateChannelInput = Readonly<{
  name: string;
}>;

type RawCreateEmailChannelInput =
  & RawBaseCreateChannelInput
  & Readonly<{
    type: "email";
    emails: readonly string[];
    userIds: readonly string[];
    events: readonly ChannelEvent[];
  }>;

type RawCreateSlackChannelInput =
  & RawBaseCreateChannelInput
  & Readonly<{
    type: "slack";
    url: string;
    mentions: Readonly<{
      ok?: string | undefined;
      warning?: string | undefined;
      critical?: string | undefined;
    }>;
    enabledGraphImage: boolean;
    events: readonly ChannelEvent[];
  }>;

type RawCreateWebhookChannelInput =
  & RawBaseCreateChannelInput
  & Readonly<{
    type: "webhook";
    url: string;
    enabledGraphImage?: boolean | undefined;
    events: readonly ChannelEvent[];
  }>;

function toRawCreateChannelInput(input: CreateChannelInput): RawCreateChannelInput {
  const base: RawBaseCreateChannelInput = {
    name: input.name,
  };
  switch (input.type) {
    case "email":
      return {
        ...base,
        type: "email",
        emails: input.emails ?? [],
        userIds: input.userIds ?? [],
        events: input.events ?? [],
      };
    case "slack":
      return {
        ...base,
        type: "slack",
        url: input.url instanceof URL ? input.url.toString() : input.url,
        mentions: {
          ok: input.mentions?.ok,
          warning: input.mentions?.warning,
          critical: input.mentions?.critical,
        },
        enabledGraphImage: input.includeGraphImages ?? false,
        events: input.events ?? [],
      };
    case "webhook":
      return {
        ...base,
        type: "webhook",
        url: input.url instanceof URL ? input.url.toString() : input.url,
        enabledGraphImage: input.includeGraphImages ?? false,
        events: input.events ?? [],
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (input satisfies never as any).type;
      throw new Error(`Unknown channel type: ${type}`, { cause: input });
    }
  }
}
