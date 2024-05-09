import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiOptions, Fetcher } from "./fetcher.ts";

assertType<
  Extends<
    Extract<Channel, { type: CreateChannelInput["type"] }>,
    CreateChannelInput
  >
>(true);
assertType<Extends<NotificationGroup, CreateNotificationGroupInput>>(true);

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

export type NotificationGroup = {
  id: string;
  name: string;
  notificationLevel: NotificationGroupNotificationLevel;
  childNotificationGroupIds: string[];
  childChannelIds: string[];
  scopes: {
    services: NotificationGroupScopeService[];
    monitors: NotificationGroupScopeMonitor[];
  };
};

export type NotificationGroupNotificationLevel = "all" | "critical";

export type NotificationGroupScopeService = {
  name: string;
};

export type NotificationGroupScopeMonitor = {
  id: string;
  maskDefaultNotificationGroup: boolean;
};

export type CreateNotificationGroupInput = Readonly<{
  name: string;
  notificationLevel?: NotificationGroupNotificationLevel | undefined;
  childNotificationGroupIds?: readonly string[] | undefined;
  childChannelIds?: readonly string[] | undefined;
  scopes?:
    | Readonly<{
      services?: readonly CreateNotificationGroupInputScopeService[] | undefined;
      monitors?: readonly CreateNotificationGroupInputScopeMonitor[] | undefined;
    }>
    | undefined;
}>;

export type CreateNotificationGroupInputScopeService = Readonly<{
  name: string;
}>;

export type CreateNotificationGroupInputScopeMonitor = Readonly<{
  id: string;
  maskDefaultNotificationGroup?: boolean | undefined;
}>;

export class ChannelsApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async list(options?: ApiOptions): Promise<Channel[]> {
    const res = await this.fetcher.fetch<{ channels: RawChannel[] }>(
      "GET",
      "/api/v0/channels",
      { signal: options?.signal },
    );
    return res.channels.map((channel) => fromRawChannel(channel));
  }

  async create(input: CreateChannelInput, options?: ApiOptions): Promise<Channel> {
    const res = await this.fetcher.fetch<RawChannel, RawCreateChannelInput>(
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
    const res = await this.fetcher.fetch<RawChannel>(
      "DELETE",
      `/api/v0/channels/${channelId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawChannel(res);
  }

  async listNotificationGroups(options?: ApiOptions): Promise<NotificationGroup[]> {
    const res = await this.fetcher.fetch<{ notificationGroups: RawNotificationGroup[] }>(
      "GET",
      "/api/v0/notification-groups",
      { signal: options?.signal },
    );
    return res.notificationGroups.map((group) => fromRawNotificationGroup(group));
  }

  async createNotificationGroups(
    input: CreateNotificationGroupInput,
    options?: ApiOptions,
  ): Promise<NotificationGroup> {
    const res = await this.fetcher.fetch<RawNotificationGroup, RawCreateNotificationGroupInput>(
      "POST",
      "/api/v0/notification-groups",
      {
        body: toRawCreateNotificationGroupInput(input),
        signal: options?.signal,
      },
    );
    return fromRawNotificationGroup(res);
  }

  async updateNotificationGroups(
    groupId: string,
    input: CreateNotificationGroupInput,
    options?: ApiOptions,
  ): Promise<NotificationGroup> {
    const res = await this.fetcher.fetch<RawNotificationGroup, RawCreateNotificationGroupInput>(
      "PUT",
      `/api/v0/notification-groups/${groupId}`,
      {
        body: toRawCreateNotificationGroupInput(input),
        signal: options?.signal,
      },
    );
    return fromRawNotificationGroup(res);
  }

  async deleteNotificationGroups(
    groupId: string,
    options?: ApiOptions,
  ): Promise<NotificationGroup> {
    const res = await this.fetcher.fetch<RawNotificationGroup>(
      "DELETE",
      `/api/v0/notification-groups/${groupId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawNotificationGroup(res);
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

type RawNotificationGroup = {
  id: string;
  name: string;
  notificationLevel: NotificationGroupNotificationLevel;
  childNotificationGroupIds: string[];
  childChannelIds: string[];
  services?: RawNotificationGroupService[] | null | undefined;
  monitors?: RawNotificationGroupMonitor[] | null | undefined;
};

type RawNotificationGroupService = {
  name: string;
};

type RawNotificationGroupMonitor = {
  id: string;
  skipDefault: boolean;
};

function fromRawNotificationGroup(raw: RawNotificationGroup): NotificationGroup {
  return {
    id: raw.id,
    name: raw.name,
    notificationLevel: raw.notificationLevel,
    childNotificationGroupIds: raw.childNotificationGroupIds,
    childChannelIds: raw.childChannelIds,
    scopes: {
      services: raw.services ?? [],
      monitors: raw.monitors
        ? raw.monitors.map((monitor) => ({
          id: monitor.id,
          maskDefaultNotificationGroup: monitor.skipDefault,
        }))
        : [],
    },
  };
}

type RawCreateNotificationGroupInput = Readonly<{
  name: string;
  notificationLevel: NotificationGroupNotificationLevel;
  childNotificationGroupIds: readonly string[];
  childChannelIds: readonly string[];
  services?: readonly RawCreateNotificationGroupInputService[] | undefined;
  monitors?: readonly RawCreateNotificationGroupInputMonitor[] | undefined;
}>;

type RawCreateNotificationGroupInputService = Readonly<{
  name: string;
}>;

type RawCreateNotificationGroupInputMonitor = Readonly<{
  id: string;
  skipDefault: boolean;
}>;

function toRawCreateNotificationGroupInput(
  input: CreateNotificationGroupInput,
): RawCreateNotificationGroupInput {
  return {
    name: input.name,
    notificationLevel: input.notificationLevel ?? "all",
    childNotificationGroupIds: input.childNotificationGroupIds ?? [],
    childChannelIds: input.childChannelIds ?? [],
    services: input.scopes?.services,
    monitors: input.scopes?.monitors
      ? input.scopes.monitors.map((monitor) => ({
        id: monitor.id,
        skipDefault: monitor.maskDefaultNotificationGroup ?? false,
      }))
      : undefined,
  };
}
