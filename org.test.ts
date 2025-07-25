import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { OrgApiClient } from "./org.ts";

describe("OrgApiClient", () => {
  describe("#get", () => {
    it("gets an Org via GET /api/v0/org", async () => {
      const handler = spy((_?: FetchOptions) => ({
        name: "foo",
        displayName: "Foo",
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/org", handler);
      const client = new OrgApiClient(fetcher);

      const org = await client.get();

      assertSpyCalls(handler, 1);

      assertEquals(org, {
        name: "foo",
        displayName: "Foo",
      });
    });
  });
});
