import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { AlertsApiClient } from "./alerts.ts";

describe("AlertsApiClient", () => {
  describe("#list", () => {
    it("lists Alerts via GET /api/v0/alerts", async () => {
      const handler = spy((_?: FetchOptions) => ({
        alerts: [
          {
            id: "alert-0",
            status: "CRITICAL",
            openedAt: 1717677296,
            memo: "test",
            monitorId: "monitor-0",
            type: "connectivity",
            hostId: "host-0",
          },
          {
            id: "alert-1",
            status: "OK",
            openedAt: 1720355696,
            closedAt: 1723120496,
            reason: "outdated",
            memo: "",
            monitorId: "monitor-1",
            type: "host",
            hostId: "host-0",
            value: 42,
          },
        ],
        nextId: "alert-2",
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/alerts", handler);
      const cli = new AlertsApiClient(fetcher);

      const { alerts, cursor } = await cli.list({
        includeClosed: true,
        limit: 2,
        cursor: "alert-0",
      });

      assertSpyCalls(handler, 1);
      const params = handler.calls[0].args[0]?.params;
      assertEquals(
        params,
        new URLSearchParams({
          withClosed: "true",
          limit: "2",
          nextId: "alert-0",
        }),
      );

      assertEquals(alerts, [
        {
          id: "alert-0",
          status: "CRITICAL",
          openedAt: new Date("2024-06-06T12:34:56Z"),
          isClosed: false,
          closedAt: undefined,
          closeReason: undefined,
          memo: "test",
          monitorId: "monitor-0",
          type: "connectivity",
          hostId: "host-0",
        },
        {
          id: "alert-1",
          status: "OK",
          openedAt: new Date("2024-07-07T12:34:56Z"),
          isClosed: true,
          closedAt: new Date("2024-08-08T12:34:56Z"),
          closeReason: "outdated",
          memo: "",
          monitorId: "monitor-1",
          type: "host",
          hostId: "host-0",
          value: 42,
        },
      ]);
      assertEquals(cursor, "alert-2");
    });
  });

  describe("#get", () => {
    it("gets an Alert via GET /api/v0/alerts/:alertId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "alert-0",
        status: "CRITICAL",
        openedAt: 1717677296,
        memo: "test",
        monitorId: "monitor-0",
        type: "connectivity",
        hostId: "host-0",
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/alerts/alert-0", handler);
      const cli = new AlertsApiClient(fetcher);

      const alert = await cli.get("alert-0");

      assertSpyCalls(handler, 1);

      assertEquals(alert, {
        id: "alert-0",
        status: "CRITICAL",
        openedAt: new Date("2024-06-06T12:34:56Z"),
        isClosed: false,
        closedAt: undefined,
        closeReason: undefined,
        memo: "test",
        monitorId: "monitor-0",
        type: "connectivity",
        hostId: "host-0",
      });
    });
  });

  describe("#update", () => {
    it("updates an Alert via PUT /api/v0/alerts/:alertId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "alert-0",
        memo: "test",
      }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/alerts/alert-0", handler);
      const cli = new AlertsApiClient(fetcher);

      await cli.update("alert-0", { memo: "test" });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, { memo: "test" });
    });
  });

  describe("close", () => {
    it("closes an Alert via POST /api/v0/alerts/:alertId/close", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "alert-0",
        status: "OK",
        openedAt: 1717677296,
        closedAt: 1720355696,
        reason: "outdated",
        memo: "test",
        monitorId: "monitor-0",
        type: "connectivity",
        hostId: "host-0",
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/alerts/alert-0/close", handler);
      const cli = new AlertsApiClient(fetcher);

      const alert = await cli.close("alert-0", "outdated");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, { reason: "outdated" });

      assertEquals(alert, {
        id: "alert-0",
        status: "OK",
        openedAt: new Date("2024-06-06T12:34:56Z"),
        isClosed: true,
        closedAt: new Date("2024-07-07T12:34:56Z"),
        closeReason: "outdated",
        memo: "test",
        monitorId: "monitor-0",
        type: "connectivity",
        hostId: "host-0",
      });
    });
  });
});
