import { assertEquals, assertRejects } from "jsr:@std/assert";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
} from "jsr:@std/testing/bdd";
import { assertSpyCalls, spy } from "jsr:@std/testing/mock";
import * as mf from "https://deno.land/x/mock_fetch@0.3.0/mod.ts";
import { ApiClient } from "./api.ts";

describe("ApiClient", () => {
  beforeAll(() => {
    mf.install();
  });

  afterAll(() => {
    mf.uninstall();
  });

  afterEach(() => {
    mf.reset();
  });

  describe("fetch", () => {
    it("can fetch without parameters and body", async () => {
      const handler = spy((_req: Request) =>
        new Response(JSON.stringify({ id: 42 }))
      );
      mf.mock("GET@/api/v0/dummy", handler);

      const client = new ApiClient("deadbeef");
      const res = await client.fetch("GET", "/api/v0/dummy");

      assertSpyCalls(handler, 1);
      const req = handler.calls[0].args[0];
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://api.mackerelio.com/api/v0/dummy");
      assertEquals(req.headers.get("X-Api-Key"), "deadbeef");
      assertEquals(req.body, null);

      assertEquals(res, { id: 42 });
    });

    it("can fetch with parameters", async () => {
      const handler = spy((_req: Request) =>
        new Response(JSON.stringify({ id: 42 }))
      );
      mf.mock("GET@/api/v0/dummy", handler);

      const client = new ApiClient("deadbeef");
      const res = await client.fetch("GET", "/api/v0/dummy", {
        params: new URLSearchParams({ foo: "bar" }),
      });

      assertSpyCalls(handler, 1);
      const req = handler.calls[0].args[0];
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://api.mackerelio.com/api/v0/dummy?foo=bar");
      assertEquals(req.headers.get("X-Api-Key"), "deadbeef");
      assertEquals(req.body, null);

      assertEquals(res, { id: 42 });
    });

    it("can fetch with body", async () => {
      const handler = spy((_req: Request) =>
        new Response(JSON.stringify({ id: 42 }))
      );
      mf.mock("POST@/api/v0/dummy", handler);

      const client = new ApiClient("deadbeef");
      const res = await client.fetch("POST", "/api/v0/dummy", {
        body: { foo: "bar" },
      });

      assertSpyCalls(handler, 1);
      const req = handler.calls[0].args[0];
      assertEquals(req.method, "POST");
      assertEquals(req.url, "https://api.mackerelio.com/api/v0/dummy");
      assertEquals(req.headers.get("X-Api-Key"), "deadbeef");
      assertEquals(req.headers.get("Content-Type"), "application/json");
      assertEquals(await req.json(), { foo: "bar" });

      assertEquals(res, { id: 42 });
    });

    it("allows to override the base URL", async () => {
      const handler = spy((_req: Request) =>
        new Response(JSON.stringify({ id: 42 }))
      );
      mf.mock("GET@/api/v0/dummy", handler);

      const client = new ApiClient("deadbeef", {
        base: "https://foo.example/",
      });
      const res = await client.fetch("GET", "/api/v0/dummy");

      assertSpyCalls(handler, 1);
      const req = handler.calls[0].args[0];
      assertEquals(req.method, "GET");
      assertEquals(req.url, "https://foo.example/api/v0/dummy");
      assertEquals(req.headers.get("X-Api-Key"), "deadbeef");
      assertEquals(req.body, null);

      assertEquals(res, { id: 42 });
    });

    it("rejects if API request was unsuccessful", async () => {
      const handler = spy((_req: Request) =>
        new Response(JSON.stringify({ error: "bad request" }), {
          status: 400,
        })
      );
      mf.mock("GET@/api/v0/dummy", handler);

      const client = new ApiClient("deadbeef");

      await assertRejects(
        () => client.fetch("GET", "/api/v0/dummy"),
        Error,
        "Failed to fetch GET /api/v0/dummy",
      );
    });
  });
});
