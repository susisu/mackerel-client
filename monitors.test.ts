import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { MonitorsApiClient } from "./monitors.ts";

describe("MonitorsApiClient", () => {
  describe("#list", () => {
    it("lists Monitors via GET /api/v0/monitors", async () => {
      const handler = spy((_?: FetchOptions) => ({
        monitors: [
          {
            id: "monitor-0",
            name: "my monitor 1",
            memo: "test",
            notificationInterval: 60,
            isMute: false,
            type: "connectivity",
            scopes: ["foo"],
            excludeScopes: ["bar"],
            alertStatusOnGone: "CRITICAL",
          },
          {
            id: "monitor-1",
            name: "my monitor 2",
            isMute: false,
            type: "host",
            metric: "loadavg5",
            scopes: ["foo"],
            excludeScopes: ["bar"],
            operator: ">",
            warning: 42,
            duration: 1,
            maxCheckAttempts: 3,
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/monitors", handler);
      const client = new MonitorsApiClient(fetcher);

      const monitors = await client.list();

      assertSpyCalls(handler, 1);

      assertEquals(monitors, [
        {
          id: "monitor-0",
          name: "my monitor 1",
          memo: "test",
          notificationIntervalMinutes: 60,
          isMuted: false,
          type: "connectivity",
          scopes: {
            include: ["foo"],
            exclude: ["bar"],
          },
          alertStatus: "CRITICAL",
        },
        {
          id: "monitor-1",
          name: "my monitor 2",
          memo: "",
          notificationIntervalMinutes: undefined,
          isMuted: false,
          type: "host",
          metricName: "loadavg5",
          scopes: {
            include: ["foo"],
            exclude: ["bar"],
          },
          conditions: {
            operator: ">",
            warning: 42,
            critical: undefined,
            averageOverDataPoints: 1,
            numAttempts: 3,
          },
        },
      ]);
    });
  });

  describe("#get", () => {
    it("gets a Monitor via GET /api/v0/monitors/:monitorId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        monitor: {
          id: "monitor-0",
          name: "my monitor",
          memo: "test",
          notificationInterval: 60,
          isMute: false,
          type: "connectivity",
          scopes: ["foo"],
          excludeScopes: ["bar"],
          alertStatusOnGone: "CRITICAL",
        },
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/monitors/monitor-0", handler);
      const client = new MonitorsApiClient(fetcher);

      const monitor = await client.get("monitor-0");

      assertSpyCalls(handler, 1);

      assertEquals(monitor, {
        id: "monitor-0",
        name: "my monitor",
        memo: "test",
        notificationIntervalMinutes: 60,
        isMuted: false,
        type: "connectivity",
        scopes: {
          include: ["foo"],
          exclude: ["bar"],
        },
        alertStatus: "CRITICAL",
      });
    });
  });

  describe("#create", () => {
    it("creates a Monitor via POST /api/v0/monitors", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "monitor-0",
        name: "my monitor",
        memo: "test",
        notificationInterval: 60,
        isMute: false,
        type: "connectivity",
        scopes: ["foo"],
        excludeScopes: ["bar"],
        alertStatusOnGone: "CRITICAL",
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/monitors", handler);
      const client = new MonitorsApiClient(fetcher);

      const monitor = await client.create({
        name: "my monitor",
        memo: "test",
        notificationIntervalMinutes: 60,
        isMuted: false,
        type: "connectivity",
        scopes: {
          include: ["foo"],
          exclude: ["bar"],
        },
        alertStatus: "CRITICAL",
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my monitor",
        memo: "test",
        notificationInterval: 60,
        isMute: false,
        type: "connectivity",
        scopes: ["foo"],
        excludeScopes: ["bar"],
        alertStatusOnGone: "CRITICAL",
      });

      assertEquals(monitor, {
        id: "monitor-0",
        name: "my monitor",
        memo: "test",
        notificationIntervalMinutes: 60,
        isMuted: false,
        type: "connectivity",
        scopes: {
          include: ["foo"],
          exclude: ["bar"],
        },
        alertStatus: "CRITICAL",
      });
    });
  });

  describe("#update", () => {
    it("updates a Monitor via PUT /api/v0/monitors/:monitorId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "monitor-0",
        name: "my monitor",
        memo: "test",
        notificationInterval: 60,
        isMute: false,
        type: "connectivity",
        scopes: ["foo"],
        excludeScopes: ["bar"],
        alertStatusOnGone: "CRITICAL",
      }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/monitors/monitor-0", handler);
      const client = new MonitorsApiClient(fetcher);

      const monitor = await client.update("monitor-0", {
        name: "my monitor",
        memo: "test",
        notificationIntervalMinutes: 60,
        isMuted: false,
        type: "connectivity",
        scopes: {
          include: ["foo"],
          exclude: ["bar"],
        },
        alertStatus: "CRITICAL",
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my monitor",
        memo: "test",
        notificationInterval: 60,
        isMute: false,
        type: "connectivity",
        scopes: ["foo"],
        excludeScopes: ["bar"],
        alertStatusOnGone: "CRITICAL",
      });

      assertEquals(monitor, {
        id: "monitor-0",
        name: "my monitor",
        memo: "test",
        notificationIntervalMinutes: 60,
        isMuted: false,
        type: "connectivity",
        scopes: {
          include: ["foo"],
          exclude: ["bar"],
        },
        alertStatus: "CRITICAL",
      });
    });
  });

  describe("#delete", () => {
    it("deletes a Monitor via DELETE /api/v0/monitors/:monitorId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "monitor-0",
        name: "my monitor",
        memo: "test",
        notificationInterval: 60,
        isMute: false,
        type: "connectivity",
        scopes: ["foo"],
        excludeScopes: ["bar"],
        alertStatusOnGone: "CRITICAL",
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/monitors/monitor-0", handler);
      const client = new MonitorsApiClient(fetcher);

      const monitor = await client.delete("monitor-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(monitor, {
        id: "monitor-0",
        name: "my monitor",
        memo: "test",
        notificationIntervalMinutes: 60,
        isMuted: false,
        type: "connectivity",
        scopes: {
          include: ["foo"],
          exclude: ["bar"],
        },
        alertStatus: "CRITICAL",
      });
    });
  });

  describe("#postCheckMonitoringReports", () => {
    it("posts check monitoring reports via POST /api/v0/monitoring/checks/report", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/monitoring/checks/report", handler);
      const client = new MonitorsApiClient(fetcher);

      await client.postCheckMonitoringReports([
        {
          name: "mycheck",
          source: {
            type: "host",
            hostId: "host-0",
          },
          status: "CRITICAL",
          message: "test",
          occurredAt: new Date("2024-06-06T12:34:56Z"),
          maxAttempts: 3,
          notificationIntervalMinutes: 60,
        },
      ]);

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        reports: [
          {
            name: "mycheck",
            source: {
              type: "host",
              hostId: "host-0",
            },
            status: "CRITICAL",
            message: "test",
            occurredAt: 1717677296,
            maxCheckAttempts: 3,
            notificationInterval: 60,
          },
        ],
      });
    });
  });
});
