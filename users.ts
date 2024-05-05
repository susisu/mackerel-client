import type { ApiClient, ApiOptions } from "./api.ts";

export type User = {
  id: string;
  screenName: string;
  email: string;
  authority: UserAuthority;
  isInRegistrationProcess: boolean;
  isMfaEnabled: boolean;
  authenticationMethods: UserAuthenticationMethod[];
  joinedAt: Date;
};

export type UserAuthority = "owner" | "manager" | "collaborator" | "viewer";

export type UserAuthenticationMethod =
  | "password"
  | "github"
  | "idcf"
  | "google"
  | "nifty"
  | "kddi";

export class UsersApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(options?: ApiOptions): Promise<User[]> {
    const res = await this.api.fetch<{ users: RawUser[] }>(
      "GET",
      "/api/v0/users",
      { signal: options?.signal },
    );
    return res.users.map((u) => fromRawUser(u));
  }

  async remove(userId: string, options?: ApiOptions): Promise<User> {
    // deno-lint-ignore ban-types
    const res = await this.api.fetch<RawUser, {}>(
      "DELETE",
      `/api/v0/users/${userId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawUser(res);
  }
}

type RawUser = {
  id: string;
  screenName: string;
  email: string;
  authority: UserAuthority;
  isInRegistrationProcess: boolean;
  isMFAEnabled: boolean;
  authenticationMethods: UserAuthenticationMethod[];
  joinedAt: number;
};

function fromRawUser(raw: RawUser): User {
  return {
    id: raw.id,
    screenName: raw.screenName,
    email: raw.email,
    authority: raw.authority,
    isInRegistrationProcess: raw.isInRegistrationProcess,
    isMfaEnabled: raw.isMFAEnabled,
    authenticationMethods: raw.authenticationMethods,
    joinedAt: new Date(raw.joinedAt * 1000),
  };
}
