import type { ApiClient, ApiOptions } from "./api.ts";

export type Invitation = {
  email: string;
  authority: InvitationAuthority;
  expiresAt: Date;
};

export type InvitationAuthority = "manager" | "collaborator" | "viewer";

export type CreateInvitationInput = Readonly<{
  email: string;
  authority: InvitationAuthority;
}>;

export class InvitationsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(options?: ApiOptions): Promise<Invitation[]> {
    const res = await this.api.fetch<{ invitations: RawInvitation[] }>(
      "GET",
      "/api/v0/invitations",
      { signal: options?.signal },
    );
    return res.invitations.map((i) => fromRawInvitation(i));
  }

  async create(
    input: CreateInvitationInput,
    options?: ApiOptions,
  ): Promise<Invitation> {
    const res = await this.api.fetch<RawInvitation, CreateInvitationInput>(
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

  async revoke(email: string, options?: ApiOptions): Promise<void> {
    await this.api.fetch<
      unknown,
      Readonly<{ email: string }>
    >(
      "POST",
      "/api/v0/invitations/revoke",
      {
        body: { email },
        signal: options?.signal,
      },
    );
  }
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
