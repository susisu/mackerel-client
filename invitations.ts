import type { ApiClient, ApiOptions } from "./api.ts";

export type Invitation = {
  email: string;
  role: InvitationRole;
  expiresAt: Date;
};

export type InvitationRole = "manager" | "collaborator" | "viewer";

export type CreateInvitationInput = Readonly<{
  email: string;
  role: InvitationRole;
}>;

export class InvitationsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(options?: ApiOptions): Promise<Invitation[]> {
    const res = await this.api.fetch<{ invitations: RawInvitation[] }>(
      "GET",
      `/api/v0/invitations`,
      { signal: options?.signal },
    );
    return res.invitations.map((i) => fromRawInvitation(i));
  }

  async create(
    input: CreateInvitationInput,
    options?: ApiOptions,
  ): Promise<Invitation> {
    type RawInput = Readonly<{
      email: string;
      authority: InvitationRole;
    }>;
    const res = await this.api.fetch<RawInvitation, RawInput>(
      "POST",
      `/api/v0/invitations`,
      {
        body: {
          email: input.email,
          authority: input.role,
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
      `/api/v0/invitations/revoke`,
      {
        body: { email },
        signal: options?.signal,
      },
    );
  }
}

type RawInvitation = {
  email: string;
  authority: InvitationRole;
  expiresAt: number;
};

function fromRawInvitation(raw: RawInvitation): Invitation {
  return {
    email: raw.email,
    role: raw.authority,
    expiresAt: new Date(raw.expiresAt * 1000),
  };
}
