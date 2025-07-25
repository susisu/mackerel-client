import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { DowntimesApiClient } from "./downtimes.ts";

describe("DowntimesApiClient", () => {
  describe("#list", () => {
    it("lists Downtimes via GET /api/v0/downtimes", async () => {
      const handler = spy((_?: FetchOptions) => ({
        downtimes: [
          {
            id: "downtime-0",
            name: "my downtime 1",
            memo: "test",
            start: 1717677296,
            duration: 60,
            recurrence: {
              interval: 1,
              type: "daily",
            },
            serviceScopes: ["foo"],
            serviceExcludeScopes: ["bar"],
            roleScopes: ["baz:xxx"],
            roleExcludeScopes: ["qux:yyy"],
            monitorScopes: ["monitor-0"],
            monitorExcludeScopes: ["monitor-1"],
          },
          {
            id: "downtime-1",
            name: "my downtime 2",
            start: 1720355696,
            duration: 120,
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/downtimes", handler);
      const client = new DowntimesApiClient(fetcher);

      const downtimes = await client.list();

      assertSpyCalls(handler, 1);

      assertEquals(downtimes, [{
        id: "downtime-0",
        name: "my downtime 1",
        memo: "test",
        start: new Date("2024-06-06T12:34:56Z"),
        durationMinutes: 60,
        recurrence: {
          interval: 1,
          until: undefined,
          type: "daily",
        },
        scopes: {
          services: {
            include: ["foo"],
            exclude: ["bar"],
          },
          roles: {
            include: ["baz:xxx"],
            exclude: ["qux:yyy"],
          },
          monitors: {
            include: ["monitor-0"],
            exclude: ["monitor-1"],
          },
        },
      }, {
        id: "downtime-1",
        name: "my downtime 2",
        memo: "",
        start: new Date("2024-07-07T12:34:56Z"),
        durationMinutes: 120,
        recurrence: undefined,
        scopes: {
          services: {
            include: [],
            exclude: [],
          },
          roles: {
            include: [],
            exclude: [],
          },
          monitors: {
            include: [],
            exclude: [],
          },
        },
      }]);
    });
  });

  describe("#create", () => {
    it("creates a Downtime via POST /api/v0/downtimes", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "downtime-0",
        name: "my downtime 1",
        memo: "test",
        start: 1717677296,
        duration: 60,
        recurrence: {
          interval: 1,
          type: "daily",
        },
        serviceScopes: ["foo"],
        serviceExcludeScopes: ["bar"],
        roleScopes: ["baz:xxx"],
        roleExcludeScopes: ["qux:yyy"],
        monitorScopes: ["monitor-0"],
        monitorExcludeScopes: ["monitor-1"],
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/downtimes", handler);
      const client = new DowntimesApiClient(fetcher);

      const downtime = await client.create({
        name: "my downtime 1",
        memo: "test",
        start: new Date("2024-06-06T12:34:56Z"),
        durationMinutes: 60,
        recurrence: {
          interval: 1,
          until: undefined,
          type: "daily",
        },
        scopes: {
          services: {
            include: ["foo"],
            exclude: ["bar"],
          },
          roles: {
            include: ["baz:xxx"],
            exclude: ["qux:yyy"],
          },
          monitors: {
            include: ["monitor-0"],
            exclude: ["monitor-1"],
          },
        },
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my downtime 1",
        memo: "test",
        start: 1717677296,
        duration: 60,
        recurrence: {
          interval: 1,
          until: undefined,
          type: "daily",
        },
        serviceScopes: ["foo"],
        serviceExcludeScopes: ["bar"],
        roleScopes: ["baz:xxx"],
        roleExcludeScopes: ["qux:yyy"],
        monitorScopes: ["monitor-0"],
        monitorExcludeScopes: ["monitor-1"],
      });

      assertEquals(downtime, {
        id: "downtime-0",
        name: "my downtime 1",
        memo: "test",
        start: new Date("2024-06-06T12:34:56Z"),
        durationMinutes: 60,
        recurrence: {
          interval: 1,
          until: undefined,
          type: "daily",
        },
        scopes: {
          services: {
            include: ["foo"],
            exclude: ["bar"],
          },
          roles: {
            include: ["baz:xxx"],
            exclude: ["qux:yyy"],
          },
          monitors: {
            include: ["monitor-0"],
            exclude: ["monitor-1"],
          },
        },
      });
    });
  });

  describe("#update", () => {
    it("updates a Downtime via PUT /api/v0/downtimes/:downtimeId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "downtime-0",
        name: "my downtime 1",
        memo: "test",
        start: 1717677296,
        duration: 60,
        recurrence: {
          interval: 1,
          type: "daily",
        },
        serviceScopes: ["foo"],
        serviceExcludeScopes: ["bar"],
        roleScopes: ["baz:xxx"],
        roleExcludeScopes: ["qux:yyy"],
        monitorScopes: ["monitor-0"],
        monitorExcludeScopes: ["monitor-1"],
      }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/downtimes/downtime-0", handler);
      const client = new DowntimesApiClient(fetcher);

      const downtime = await client.update("downtime-0", {
        name: "my downtime 1",
        memo: "test",
        start: new Date("2024-06-06T12:34:56Z"),
        durationMinutes: 60,
        recurrence: {
          interval: 1,
          until: undefined,
          type: "daily",
        },
        scopes: {
          services: {
            include: ["foo"],
            exclude: ["bar"],
          },
          roles: {
            include: ["baz:xxx"],
            exclude: ["qux:yyy"],
          },
          monitors: {
            include: ["monitor-0"],
            exclude: ["monitor-1"],
          },
        },
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my downtime 1",
        memo: "test",
        start: 1717677296,
        duration: 60,
        recurrence: {
          interval: 1,
          until: undefined,
          type: "daily",
        },
        serviceScopes: ["foo"],
        serviceExcludeScopes: ["bar"],
        roleScopes: ["baz:xxx"],
        roleExcludeScopes: ["qux:yyy"],
        monitorScopes: ["monitor-0"],
        monitorExcludeScopes: ["monitor-1"],
      });

      assertEquals(downtime, {
        id: "downtime-0",
        name: "my downtime 1",
        memo: "test",
        start: new Date("2024-06-06T12:34:56Z"),
        durationMinutes: 60,
        recurrence: {
          interval: 1,
          until: undefined,
          type: "daily",
        },
        scopes: {
          services: {
            include: ["foo"],
            exclude: ["bar"],
          },
          roles: {
            include: ["baz:xxx"],
            exclude: ["qux:yyy"],
          },
          monitors: {
            include: ["monitor-0"],
            exclude: ["monitor-1"],
          },
        },
      });
    });
  });

  describe("#delete", () => {
    it("deletes a Downtime via DELETE /api/v0/downtimes/:downtimeId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "downtime-0",
        name: "my downtime 1",
        memo: "test",
        start: 1717677296,
        duration: 60,
        recurrence: {
          interval: 1,
          type: "daily",
        },
        serviceScopes: ["foo"],
        serviceExcludeScopes: ["bar"],
        roleScopes: ["baz:xxx"],
        roleExcludeScopes: ["qux:yyy"],
        monitorScopes: ["monitor-0"],
        monitorExcludeScopes: ["monitor-1"],
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/downtimes/downtime-0", handler);
      const client = new DowntimesApiClient(fetcher);

      const downtime = await client.delete("downtime-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(downtime, {
        id: "downtime-0",
        name: "my downtime 1",
        memo: "test",
        start: new Date("2024-06-06T12:34:56Z"),
        durationMinutes: 60,
        recurrence: {
          interval: 1,
          until: undefined,
          type: "daily",
        },
        scopes: {
          services: {
            include: ["foo"],
            exclude: ["bar"],
          },
          roles: {
            include: ["baz:xxx"],
            exclude: ["qux:yyy"],
          },
          monitors: {
            include: ["monitor-0"],
            exclude: ["monitor-1"],
          },
        },
      });
    });
  });
});
