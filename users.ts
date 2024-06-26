import type { ApiOptions, Fetcher } from "./fetcher.ts";

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

export type Invitation = {
  email: string;
  authority: InvitationAuthority;
  expiresAt: Date;
};

export type InvitationAuthority = Exclude<UserAuthority, "owner">;

export type SendInvitationInput = Readonly<{
  email: string;
  authority: InvitationAuthority;
}>;

export class UsersApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async list(options?: ApiOptions): Promise<User[]> {
    const res = await this.fetcher.fetch<{ users: RawUser[] }>(
      "GET",
      "/api/v0/users",
      { signal: options?.signal },
    );
    return res.users.map((user) => fromRawUser(user));
  }

  async remove(userId: string, options?: ApiOptions): Promise<User> {
    const res = await this.fetcher.fetch<RawUser>(
      "DELETE",
      `/api/v0/users/${userId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawUser(res);
  }

  async listInvitations(options?: ApiOptions): Promise<Invitation[]> {
    const res = await this.fetcher.fetch<{ invitations: RawInvitation[] }>(
      "GET",
      "/api/v0/invitations",
      { signal: options?.signal },
    );
    return res.invitations.map((invitation) => fromRawInvitation(invitation));
  }

  async sendInvitation(
    input: SendInvitationInput,
    options?: ApiOptions,
  ): Promise<Invitation> {
    const res = await this.fetcher.fetch<RawInvitation, SendInvitationInput>(
      "POST",
      "/api/v0/invitations",
      {
        body: {
          email: input.email,
          authority: input.authority,
        },
        signal: options?.signal,
      },
    );
    return fromRawInvitation(res);
  }

  async revokeInvitation(email: string, options?: ApiOptions): Promise<void> {
    await this.fetcher.fetch<unknown, Readonly<{ email: string }>>(
      "POST",
      "/api/v0/invitations/revoke",
      {
        body: { email },
        signal: options?.signal,
      },
    );
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

type RawInvitation = {
  email: string;
  authority: InvitationAuthority;
  expiresAt: number;
};

function fromRawInvitation(raw: RawInvitation): Invitation {
  return {
    email: raw.email,
    authority: raw.authority,
    expiresAt: new Date(raw.expiresAt * 1000),
  };
}
