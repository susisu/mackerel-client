import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { GraphDefsApiClient } from "./graphDefs.ts";

describe("GraphDefsApiClient", () => {
  describe("#createHostGraphDefs", () => {
    it("creates GraphDefs via POST /api/v0/graph-defs/create", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/graph-defs/create", handler);
      const cli = new GraphDefsApiClient(fetcher);

      await cli.createHostGraphDefs([
        {
          name: "custom.foo",
          displayName: "foo",
          unit: "bytes",
          metrics: [
            {
              name: "custom.foo.xxx",
              displayName: "xxx",
              isStacked: true,
            },
            {
              name: "custom.foo.yyy",
            },
          ],
        },
        {
          name: "custom.bar",
        },
      ]);

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, [
        {
          name: "custom.foo",
          displayName: "foo",
          unit: "bytes",
          metrics: [
            {
              name: "custom.foo.xxx",
              displayName: "xxx",
              isStacked: true,
            },
            {
              name: "custom.foo.yyy",
              displayName: undefined,
              isStacked: false,
            },
          ],
        },
        {
          name: "custom.bar",
          displayName: undefined,
          unit: "float",
          metrics: [],
        },
      ]);
    });
  });
});
