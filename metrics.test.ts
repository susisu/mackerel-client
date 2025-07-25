import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { MetricsApiClient } from "./metrics.ts";

describe("MetricsApiClient", () => {
  describe("#listHostMetricNames", () => {
    it("list Host metric names via GET /api/v0/hosts/:hostId/metric-names", async () => {
      const handler = spy((_?: FetchOptions) => ({
        names: ["loadavg5", "cpu.user.percentage"],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/hosts/host-0/metric-names", handler);
      const client = new MetricsApiClient(fetcher);

      const metricNames = await client.listHostMetricNames("host-0");

      assertSpyCalls(handler, 1);

      assertEquals(metricNames, ["loadavg5", "cpu.user.percentage"]);
    });
  });

  describe("#getHostMetricDataPoints", () => {
    it("gets DataPoints via GET /api/v0/hosts/:hostId/metrics", async () => {
      const handler = spy((_?: FetchOptions) => ({
        metrics: [
          { time: 1717675200, value: 42 },
          { time: 1717675260, value: 43 },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/hosts/host-0/metrics", handler);
      const client = new MetricsApiClient(fetcher);

      const dataPoints = await client.getHostMetricDataPoints("host-0", "loadavg5", {
        from: new Date("2024-06-06T12:00:00Z"),
        to: new Date("2024-06-06T13:00:00Z"),
      });

      assertSpyCalls(handler, 1);
      const params = handler.calls[0].args[0]?.params;
      assertEquals(
        params,
        new URLSearchParams({
          name: "loadavg5",
          from: "1717675200",
          to: "1717678800",
        }),
      );

      assertEquals(dataPoints, [
        { time: new Date("2024-06-06T12:00:00Z"), value: 42 },
        { time: new Date("2024-06-06T12:01:00Z"), value: 43 },
      ]);
    });
  });

  describe("#getServiceMetricDataPoints", () => {
    it("gets DataPoints via GET /api/v0/services/:serviceName/metrics", async () => {
      const handler = spy((_?: FetchOptions) => ({
        metrics: [
          { time: 1717675200, value: 42 },
          { time: 1717675260, value: 43 },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/services/foo/metrics", handler);
      const client = new MetricsApiClient(fetcher);

      const dataPoints = await client.getServiceMetricDataPoints("foo", "abc", {
        from: new Date("2024-06-06T12:00:00Z"),
        to: new Date("2024-06-06T13:00:00Z"),
      });

      assertSpyCalls(handler, 1);
      const params = handler.calls[0].args[0]?.params;
      assertEquals(
        params,
        new URLSearchParams({
          name: "abc",
          from: "1717675200",
          to: "1717678800",
        }),
      );

      assertEquals(dataPoints, [
        { time: new Date("2024-06-06T12:00:00Z"), value: 42 },
        { time: new Date("2024-06-06T12:01:00Z"), value: 43 },
      ]);
    });
  });

  describe("#getLatestHostMetricDataPoints", () => {
    it("gets the latest DataPoints via GET /api/v0/tsdb/latest", async () => {
      const handler = spy((_?: FetchOptions) => ({
        tsdbLatest: {
          "host-0": {
            "loadavg5": { time: 1717675200, value: 42 },
            "cpu.user.percentage": { time: 1717675260, value: 43 },
          },
          "host-1": {
            "loadavg5": { time: 1717675200, value: 44 },
            "cpu.user.percentage": { time: 1717675260, value: 45 },
          },
        },
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/tsdb/latest", handler);
      const client = new MetricsApiClient(fetcher);

      const dataPoints = await client.getLatestHostMetricDataPoints(["host-0", "host-1"], [
        "loadavg5",
        "cpu.user.percentage",
      ]);

      assertSpyCalls(handler, 1);
      const params = handler.calls[0].args[0]?.params;
      assertEquals(
        params,
        new URLSearchParams([
          ["hostId", "host-0"],
          ["hostId", "host-1"],
          ["name", "loadavg5"],
          ["name", "cpu.user.percentage"],
        ]),
      );

      assertEquals(
        dataPoints,
        new Map([
          [
            "host-0",
            new Map([
              ["loadavg5", { time: new Date("2024-06-06T12:00:00Z"), value: 42 }],
              ["cpu.user.percentage", { time: new Date("2024-06-06T12:01:00Z"), value: 43 }],
            ]),
          ],
          [
            "host-1",
            new Map([
              ["loadavg5", { time: new Date("2024-06-06T12:00:00Z"), value: 44 }],
              ["cpu.user.percentage", { time: new Date("2024-06-06T12:01:00Z"), value: 45 }],
            ]),
          ],
        ]),
      );
    });
  });

  describe("#postHostMetrics", () => {
    it("posts DataPoints via POST /api/v0/tsdb", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/tsdb", handler);
      const client = new MetricsApiClient(fetcher);

      await client.postHostMetrics(
        "host-0",
        new Map([
          ["loadavg5", [
            { time: new Date("2024-06-06T12:00:00Z"), value: 42 },
            { time: new Date("2024-06-06T12:01:00Z"), value: 43 },
          ]],
          ["cpu.user.percentage", [
            { time: new Date("2024-06-06T12:00:00Z"), value: 44 },
            { time: new Date("2024-06-06T12:01:00Z"), value: 45 },
          ]],
        ]),
      );

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, [
        { hostId: "host-0", name: "loadavg5", time: 1717675200, value: 42 },
        { hostId: "host-0", name: "loadavg5", time: 1717675260, value: 43 },
        { hostId: "host-0", name: "cpu.user.percentage", time: 1717675200, value: 44 },
        { hostId: "host-0", name: "cpu.user.percentage", time: 1717675260, value: 45 },
      ]);
    });
  });

  describe("#bulkPostHostMetrics", () => {
    it("posts DataPoints of multiple Hosts via POST /api/v0/tsdb", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/tsdb", handler);
      const client = new MetricsApiClient(fetcher);

      await client.bulkPostHostMetrics(
        new Map([
          [
            "host-0",
            new Map([
              ["loadavg5", [{ time: new Date("2024-06-06T12:00:00Z"), value: 42 }]],
              ["cpu.user.percentage", [{ time: new Date("2024-06-06T12:01:00Z"), value: 43 }]],
            ]),
          ],
          [
            "host-1",
            new Map([
              ["loadavg5", [{ time: new Date("2024-06-06T12:00:00Z"), value: 44 }]],
              ["cpu.user.percentage", [{ time: new Date("2024-06-06T12:01:00Z"), value: 45 }]],
            ]),
          ],
        ]),
      );

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, [
        { hostId: "host-0", name: "loadavg5", time: 1717675200, value: 42 },
        { hostId: "host-0", name: "cpu.user.percentage", time: 1717675260, value: 43 },
        { hostId: "host-1", name: "loadavg5", time: 1717675200, value: 44 },
        { hostId: "host-1", name: "cpu.user.percentage", time: 1717675260, value: 45 },
      ]);
    });
  });

  describe("#postServiceMetrics", () => {
    it("posts DataPoints via POST /api/v0/services/:serviceName/tsdb", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/services/foo/tsdb", handler);
      const client = new MetricsApiClient(fetcher);

      await client.postServiceMetrics(
        "foo",
        new Map([
          ["abc", [
            { time: new Date("2024-06-06T12:00:00Z"), value: 42 },
            { time: new Date("2024-06-06T12:01:00Z"), value: 43 },
          ]],
          ["def", [
            { time: new Date("2024-06-06T12:00:00Z"), value: 44 },
            { time: new Date("2024-06-06T12:01:00Z"), value: 45 },
          ]],
        ]),
      );

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, [
        { name: "abc", time: 1717675200, value: 42 },
        { name: "abc", time: 1717675260, value: 43 },
        { name: "def", time: 1717675200, value: 44 },
        { name: "def", time: 1717675260, value: 45 },
      ]);
    });
  });
});
