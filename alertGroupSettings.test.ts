import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { AlertGroupSettingsApiClient } from "./alertGroupSettings.ts";

describe("AlertGroupSettingsApiClient", () => {
  describe("#list", () => {
    it("list AlertGroupSettings via GET /api/v0/alert-group-settings", async () => {
      const handler = spy((_?: FetchOptions) => ({
        alertGroupSettings: [
          {
            id: "setting-0",
            name: "my alert group 1",
            memo: "test",
            serviceScopes: ["foo"],
            roleScopes: ["bar:xxx"],
            monitorScopes: ["monitor-0"],
            notificationInterval: 60,
          },
          {
            id: "setting-1",
            name: "my alert group 2",
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/alert-group-settings", handler);
      const cli = new AlertGroupSettingsApiClient(fetcher);

      const settings = await cli.list();

      assertSpyCalls(handler, 1);

      assertEquals(settings, [
        {
          id: "setting-0",
          name: "my alert group 1",
          memo: "test",
          scopes: {
            services: ["foo"],
            roles: ["bar:xxx"],
            monitors: ["monitor-0"],
          },
          notificationIntervalMinutes: 60,
        },
        {
          id: "setting-1",
          name: "my alert group 2",
          memo: "",
          scopes: {
            services: undefined,
            roles: undefined,
            monitors: undefined,
          },
          notificationIntervalMinutes: undefined,
        },
      ]);
    });
  });

  describe("#get", () => {
    it("gets an AlertGroupSetting via GET /api/v0/alert-group-settings/:settingId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "setting-0",
        name: "my alert group",
        memo: "test",
        serviceScopes: ["foo"],
        roleScopes: ["bar:xxx"],
        monitorScopes: ["monitor-0"],
        notificationInterval: 60,
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/alert-group-settings/setting-0", handler);
      const cli = new AlertGroupSettingsApiClient(fetcher);

      const setting = await cli.get("setting-0");

      assertSpyCalls(handler, 1);

      assertEquals(setting, {
        id: "setting-0",
        name: "my alert group",
        memo: "test",
        scopes: {
          services: ["foo"],
          roles: ["bar:xxx"],
          monitors: ["monitor-0"],
        },
        notificationIntervalMinutes: 60,
      });
    });
  });

  describe("#create", () => {
    it("creates an AlertGroupSetting via POST /api/v0/alert-group-settings", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "setting-0",
        name: "my alert group",
        memo: "test",
        serviceScopes: ["foo"],
        roleScopes: ["bar:xxx"],
        monitorScopes: ["monitor-0"],
        notificationInterval: 60,
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/alert-group-settings", handler);
      const cli = new AlertGroupSettingsApiClient(fetcher);

      const setting = await cli.create({
        name: "my alert group",
        memo: "test",
        scopes: {
          services: ["foo"],
          roles: ["bar:xxx"],
          monitors: ["monitor-0"],
        },
        notificationIntervalMinutes: 60,
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my alert group",
        memo: "test",
        serviceScopes: ["foo"],
        roleScopes: ["bar:xxx"],
        monitorScopes: ["monitor-0"],
        notificationInterval: 60,
      });

      assertEquals(setting, {
        id: "setting-0",
        name: "my alert group",
        memo: "test",
        scopes: {
          services: ["foo"],
          roles: ["bar:xxx"],
          monitors: ["monitor-0"],
        },
        notificationIntervalMinutes: 60,
      });
    });
  });

  describe("#update", () => {
    it("updates an AlertGroupSetting via POST /api/v0/alert-group-settings/:settingId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "setting-0",
        name: "my alert group",
        memo: "test",
        serviceScopes: ["foo"],
        roleScopes: ["bar:xxx"],
        monitorScopes: ["monitor-0"],
        notificationInterval: 60,
      }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/alert-group-settings/setting-0", handler);
      const cli = new AlertGroupSettingsApiClient(fetcher);

      const setting = await cli.update("setting-0", {
        name: "my alert group",
        memo: "test",
        scopes: {
          services: ["foo"],
          roles: ["bar:xxx"],
          monitors: ["monitor-0"],
        },
        notificationIntervalMinutes: 60,
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my alert group",
        memo: "test",
        serviceScopes: ["foo"],
        roleScopes: ["bar:xxx"],
        monitorScopes: ["monitor-0"],
        notificationInterval: 60,
      });

      assertEquals(setting, {
        id: "setting-0",
        name: "my alert group",
        memo: "test",
        scopes: {
          services: ["foo"],
          roles: ["bar:xxx"],
          monitors: ["monitor-0"],
        },
        notificationIntervalMinutes: 60,
      });
    });
  });

  describe("#delete", () => {
    it("deletes an AlertGroupSetting via DELETE /api/v0/alert-group-settings/:settingId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "setting-0",
        name: "my alert group",
        memo: "test",
        serviceScopes: ["foo"],
        roleScopes: ["bar:xxx"],
        monitorScopes: ["monitor-0"],
        notificationInterval: 60,
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/alert-group-settings/setting-0", handler);
      const cli = new AlertGroupSettingsApiClient(fetcher);

      const setting = await cli.delete("setting-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(setting, {
        id: "setting-0",
        name: "my alert group",
        memo: "test",
        scopes: {
          services: ["foo"],
          roles: ["bar:xxx"],
          monitors: ["monitor-0"],
        },
        notificationIntervalMinutes: 60,
      });
    });
  });
});
