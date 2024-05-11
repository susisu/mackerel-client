import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiOptions, Fetcher } from "./fetcher.ts";

assertType<Extends<AlertGroupSetting, CreateAlertGroupSettingInput>>(true);

export type AlertGroupSetting = {
  id: string;
  name: string;
  memo: string;
  scopes: {
    /** service names */
    services: string[];
    /** role fullnames */
    roles: string[];
    /** monitor ids */
    monitors: string[];
  };
  notificationIntervalMinutes: number | undefined;
};

export type CreateAlertGroupSettingInput = Readonly<{
  name: string;
  memo?: string | undefined;
  scopes?:
    | Readonly<{
      /** service names */
      services?: readonly string[] | undefined;
      /** role fullnames */
      roles?: readonly string[] | undefined;
      /** monitor ids */
      monitors?: readonly string[] | undefined;
    }>
    | undefined;
  notificationIntervalMinutes?: number | undefined;
}>;

export class AlertGroupSettingsApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async list(options?: ApiOptions): Promise<AlertGroupSetting[]> {
    const res = await this.fetcher.fetch<{ alertGroupSettings: RawAlertGroupSetting[] }>(
      "GET",
      "/api/v0/alert-group-settings",
      { signal: options?.signal },
    );
    return res.alertGroupSettings.map((setting) => fromRawAlertGroupSetting(setting));
  }

  async get(settingId: string, options?: ApiOptions): Promise<AlertGroupSetting> {
    const res = await this.fetcher.fetch<RawAlertGroupSetting>(
      "GET",
      `/api/v0/alert-group-settings/${settingId}`,
      { signal: options?.signal },
    );
    return fromRawAlertGroupSetting(res);
  }

  async create(
    input: CreateAlertGroupSettingInput,
    options?: ApiOptions,
  ): Promise<AlertGroupSetting> {
    const res = await this.fetcher.fetch<RawAlertGroupSetting, RawCreateAlertGroupSettingInput>(
      "POST",
      "/api/v0/alert-group-settings",
      {
        body: toRawCreateAlertGroupSettingInput(input),
        signal: options?.signal,
      },
    );
    return fromRawAlertGroupSetting(res);
  }

  async update(
    settingId: string,
    input: CreateAlertGroupSettingInput,
    options?: ApiOptions,
  ): Promise<AlertGroupSetting> {
    const res = await this.fetcher.fetch<RawAlertGroupSetting, RawCreateAlertGroupSettingInput>(
      "PUT",
      `/api/v0/alert-group-settings/${settingId}`,
      {
        body: toRawCreateAlertGroupSettingInput(input),
        signal: options?.signal,
      },
    );
    return fromRawAlertGroupSetting(res);
  }

  async delete(settingId: string, options?: ApiOptions): Promise<AlertGroupSetting> {
    const res = await this.fetcher.fetch<RawAlertGroupSetting>(
      "DELETE",
      `/api/v0/alert-group-settings/${settingId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawAlertGroupSetting(res);
  }
}

type RawAlertGroupSetting = {
  id: string;
  name: string;
  memo?: string | null | undefined;
  serviceScopes?: string[] | null | undefined;
  roleScopes?: string[] | null | undefined;
  monitorScopes?: string[] | null | undefined;
  notificationInterval?: number | null | undefined;
};

function fromRawAlertGroupSetting(raw: RawAlertGroupSetting): AlertGroupSetting {
  return {
    id: raw.id,
    name: raw.name,
    memo: raw.memo ?? "",
    scopes: {
      services: raw.serviceScopes ?? [],
      roles: raw.roleScopes ?? [],
      monitors: raw.monitorScopes ?? [],
    },
    notificationIntervalMinutes: raw.notificationInterval ?? undefined,
  };
}

type RawCreateAlertGroupSettingInput = Readonly<{
  name: string;
  memo?: string | undefined;
  serviceScopes?: readonly string[] | undefined;
  roleScopes?: readonly string[] | undefined;
  monitorScopes?: readonly string[] | undefined;
  notificationInterval?: number | undefined;
}>;

function toRawCreateAlertGroupSettingInput(
  input: CreateAlertGroupSettingInput,
): RawCreateAlertGroupSettingInput {
  return {
    name: input.name,
    memo: input.memo,
    serviceScopes: input.scopes?.services,
    roleScopes: input.scopes?.roles,
    monitorScopes: input.scopes?.monitors,
    notificationInterval: input.notificationIntervalMinutes,
  };
}
