import { assertEquals, assertRejects } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, stub } from "@std/testing/mock";
import { DefaultFetcher } from "./fetcher.ts";

describe("DefaultFetcher", () => {
  describe("fetch", () => {
    it("can fetch without parameters and body", async () => {
      using fetchStub = stub(globalThis, "fetch", async () => {
        return await new Response(JSON.stringify({ id: 42 }));
      });

      const fetcher = new DefaultFetcher("deadbeef");
      const res = await fetcher.fetch("GET", "/api/v0/dummy");

      assertSpyCalls(fetchStub, 1);
      const req = fetchStub.calls[0].args[0] as Request;
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://api.mackerelio.com/api/v0/dummy");
      assertEquals(req.headers.get("X-Api-Key"), "deadbeef");
      assertEquals(req.body, null);

      assertEquals(res, { id: 42 });
    });

    it("can fetch with parameters", async () => {
      using fetchStub = stub(globalThis, "fetch", async () => {
        return await new Response(JSON.stringify({ id: 42 }));
      });

      const fetcher = new DefaultFetcher("deadbeef");
      const res = await fetcher.fetch("GET", "/api/v0/dummy", {
        params: new URLSearchParams({ foo: "bar" }),
      });

      assertSpyCalls(fetchStub, 1);
      const req = fetchStub.calls[0].args[0] as Request;
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://api.mackerelio.com/api/v0/dummy?foo=bar");
      assertEquals(req.headers.get("X-Api-Key"), "deadbeef");
      assertEquals(req.body, null);

      assertEquals(res, { id: 42 });
    });

    it("can fetch with body", async () => {
      using fetchStub = stub(globalThis, "fetch", async () => {
        return await new Response(JSON.stringify({ id: 42 }));
      });

      const fetcher = new DefaultFetcher("deadbeef");
      const res = await fetcher.fetch("POST", "/api/v0/dummy", {
        body: { foo: "bar" },
      });

      assertSpyCalls(fetchStub, 1);
      const req = fetchStub.calls[0].args[0] as Request;
      assertEquals(req.method, "POST");
      assertEquals(req.url, "https://api.mackerelio.com/api/v0/dummy");
      assertEquals(req.headers.get("X-Api-Key"), "deadbeef");
      assertEquals(req.headers.get("Content-Type"), "application/json");
      assertEquals(await req.json(), { foo: "bar" });

      assertEquals(res, { id: 42 });
    });

    it("allows to override the base URL", async () => {
      using fetchStub = stub(globalThis, "fetch", async () => {
        return await new Response(JSON.stringify({ id: 42 }));
      });

      const fetcher = new DefaultFetcher("deadbeef", {
        base: "https://foo.example/",
      });
      const res = await fetcher.fetch("GET", "/api/v0/dummy");

      assertSpyCalls(fetchStub, 1);
      const req = fetchStub.calls[0].args[0] as Request;
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://foo.example/api/v0/dummy");
      assertEquals(req.headers.get("X-Api-Key"), "deadbeef");
      assertEquals(req.body, null);

      assertEquals(res, { id: 42 });
    });

    it("rejects if API request was unsuccessful", async () => {
      using _fetchStub = stub(globalThis, "fetch", async () => {
        return await new Response(JSON.stringify({ error: "bad request" }), {
          status: 400,
        });
      });

      const fetcher = new DefaultFetcher("deadbeef");

      await assertRejects(
        () => fetcher.fetch("GET", "/api/v0/dummy"),
        Error,
        "Failed to fetch GET /api/v0/dummy",
      );
    });
  });
});
