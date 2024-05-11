import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { UsersApiClient } from "./users.ts";

describe("UsersApiClient", () => {
  describe("#list", () => {
    it("lists Users via GET /api/v0/users", async () => {
      const handler = spy((_?: FetchOptions) => ({
        users: [
          {
            id: "user-0",
            screenName: "foo",
            email: "foo@example.com",
            authority: "owner",
            isInRegistrationProcess: false,
            isMFAEnabled: true,
            authenticationMethods: ["password", "github"],
            joinedAt: 1717677296,
          },
          {
            id: "user-1",
            screenName: "bar",
            email: "bar@example.com",
            authority: "manager",
            isInRegistrationProcess: false,
            isMFAEnabled: false,
            authenticationMethods: ["password"],
            joinedAt: 1720355696,
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/users", handler);
      const cli = new UsersApiClient(fetcher);

      const users = await cli.list();

      assertSpyCalls(handler, 1);

      assertEquals(users, [
        {
          id: "user-0",
          screenName: "foo",
          email: "foo@example.com",
          authority: "owner",
          isInRegistrationProcess: false,
          isMfaEnabled: true,
          authenticationMethods: ["password", "github"],
          joinedAt: new Date("2024-06-06T12:34:56Z"),
        },
        {
          id: "user-1",
          screenName: "bar",
          email: "bar@example.com",
          authority: "manager",
          isInRegistrationProcess: false,
          isMfaEnabled: false,
          authenticationMethods: ["password"],
          joinedAt: new Date("2024-07-07T12:34:56Z"),
        },
      ]);
    });
  });

  describe("#remove", () => {
    it("removes a User via DELETE /api/v0/users/:userId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "user-1",
        screenName: "bar",
        email: "bar@example.com",
        authority: "manager",
        isInRegistrationProcess: false,
        isMFAEnabled: false,
        authenticationMethods: ["password"],
        joinedAt: 1720355696,
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/users/user-1", handler);
      const cli = new UsersApiClient(fetcher);

      const user = await cli.remove("user-1");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(user, {
        id: "user-1",
        screenName: "bar",
        email: "bar@example.com",
        authority: "manager",
        isInRegistrationProcess: false,
        isMfaEnabled: false,
        authenticationMethods: ["password"],
        joinedAt: new Date("2024-07-07T12:34:56Z"),
      });
    });
  });

  describe("#listInvitations", () => {
    it("lists Invitations via GET /api/v0/invitations", async () => {
      const handler = spy((_?: FetchOptions) => ({
        invitations: [
          {
            email: "foo@example.com",
            authority: "manager",
            expiresAt: 1717677296,
          },
          {
            email: "bar@example.com",
            authority: "collaborator",
            expiresAt: 1720355696,
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/invitations", handler);
      const cli = new UsersApiClient(fetcher);

      const invitations = await cli.listInvitations();

      assertSpyCalls(handler, 1);

      assertEquals(invitations, [
        {
          email: "foo@example.com",
          authority: "manager",
          expiresAt: new Date("2024-06-06T12:34:56Z"),
        },
        {
          email: "bar@example.com",
          authority: "collaborator",
          expiresAt: new Date("2024-07-07T12:34:56Z"),
        },
      ]);
    });
  });

  describe("#sendInvitation", () => {
    it("sends an Invitation via POST /api/v0/invitations", async () => {
      const handler = spy((_?: FetchOptions) => ({
        email: "foo@example.com",
        authority: "manager",
        expiresAt: 1717677296,
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/invitations", handler);
      const cli = new UsersApiClient(fetcher);

      const invitation = await cli.sendInvitation({
        email: "foo@example.com",
        authority: "manager",
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        email: "foo@example.com",
        authority: "manager",
      });

      assertEquals(invitation, {
        email: "foo@example.com",
        authority: "manager",
        expiresAt: new Date("2024-06-06T12:34:56Z"),
      });
    });
  });

  describe("#revokeInvitation", () => {
    it("revokes an Invitation via POST /api/v0/invitations/revoke", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/invitations/revoke", handler);
      const cli = new UsersApiClient(fetcher);

      await cli.revokeInvitation("foo@example.com");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, { email: "foo@example.com" });
    });
  });
});
