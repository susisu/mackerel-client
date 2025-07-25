import { assertEquals, assertThrows } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { makeRoleFullname, parseRoleFullname, ServicesApiClient } from "./services.ts";

describe("ServicesApiClient", () => {
  describe("#list", () => {
    it("lists Services via GET /api/v0/services", async () => {
      const handler = spy((_?: FetchOptions) => ({
        services: [
          {
            name: "foo",
            memo: "test",
            roles: ["xxx", "yyy"],
          },
          {
            name: "bar",
            memo: "",
            roles: ["zzz"],
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/services", handler);
      const client = new ServicesApiClient(fetcher);

      const services = await client.list();

      assertSpyCalls(handler, 1);

      assertEquals(services, [
        {
          name: "foo",
          memo: "test",
          roles: ["xxx", "yyy"],
        },
        {
          name: "bar",
          memo: "",
          roles: ["zzz"],
        },
      ]);
    });
  });

  describe("#create", () => {
    it("creates a Service via POST /api/v0/services", async () => {
      const handler = spy((_?: FetchOptions) => ({
        name: "foo",
        memo: "test",
        roles: [],
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/services", handler);
      const client = new ServicesApiClient(fetcher);

      const service = await client.create({
        name: "foo",
        memo: "test",
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "foo",
        memo: "test",
      });

      assertEquals(service, {
        name: "foo",
        memo: "test",
        roles: [],
      });
    });
  });

  describe("#delete", () => {
    it("deletes a Service via DELETE /api/v0/services/:serviceName", async () => {
      const handler = spy((_?: FetchOptions) => ({
        name: "foo",
        memo: "test",
        roles: ["xxx", "yyy"],
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/services/foo", handler);
      const client = new ServicesApiClient(fetcher);

      const service = await client.delete("foo");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(service, {
        name: "foo",
        memo: "test",
        roles: ["xxx", "yyy"],
      });
    });
  });

  describe("#listRoles", () => {
    it("lists Roles via GET /api/v0/services/:serviceName/roles", async () => {
      const handler = spy((_?: FetchOptions) => ({
        roles: [
          {
            name: "xxx",
            memo: "test",
          },
          {
            name: "yyy",
            memo: "",
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/services/foo/roles", handler);
      const client = new ServicesApiClient(fetcher);

      const roles = await client.listRoles("foo");

      assertSpyCalls(handler, 1);

      assertEquals(roles, [
        {
          name: "xxx",
          memo: "test",
        },
        {
          name: "yyy",
          memo: "",
        },
      ]);
    });
  });

  describe("#createRole", () => {
    it("creates a Role via POST /api/v0/services/:serviceName/roles", async () => {
      const handler = spy((_?: FetchOptions) => ({
        name: "xxx",
        memo: "test",
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/services/foo/roles", handler);
      const client = new ServicesApiClient(fetcher);

      const role = await client.createRole("foo", {
        name: "xxx",
        memo: "test",
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "xxx",
        memo: "test",
      });

      assertEquals(role, {
        name: "xxx",
        memo: "test",
      });
    });
  });

  describe("#delete", () => {
    it("deletes a Role via DELETE /api/v0/services/:serviceName/roles/:roleName", async () => {
      const handler = spy((_?: FetchOptions) => ({
        name: "xxx",
        memo: "test",
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/services/foo/roles/xxx", handler);
      const client = new ServicesApiClient(fetcher);

      const role = await client.deleteRole("foo:xxx");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(role, {
        name: "xxx",
        memo: "test",
      });
    });
  });

  describe("#listMetricNames", () => {
    it("lists Service metric names via GET /api/v0/services/:serviceName/metric-names", async () => {
      const handler = spy((_?: FetchOptions) => ({
        names: ["abc", "def"],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/services/foo/metric-names", handler);
      const client = new ServicesApiClient(fetcher);

      const metricNames = await client.listMetricNames("foo");

      assertSpyCalls(handler, 1);

      assertEquals(metricNames, ["abc", "def"]);
    });
  });

  describe("#listMetadataNamespaces", () => {
    it("lists Service metadata namespaces via GET /api/v0/services/:serviceName/metadata", async () => {
      const handler = spy((_?: FetchOptions) => ({
        metadata: [
          { namespace: "abc" },
          { namespace: "def" },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/services/foo/metadata", handler);
      const client = new ServicesApiClient(fetcher);

      const namespaces = await client.listMetadataNamespaces("foo");

      assertSpyCalls(handler, 1);

      assertEquals(namespaces, ["abc", "def"]);
    });
  });

  describe("#getMetadata", () => {
    it("lists Service metadata via GET /api/v0/services/:serviceName/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ test: 42 }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/services/foo/metadata/abc", handler);
      const client = new ServicesApiClient(fetcher);

      const metadata = await client.getMetadata("foo", "abc");

      assertSpyCalls(handler, 1);

      assertEquals(metadata, { test: 42 });
    });
  });

  describe("#putMetadata", () => {
    it("puts Service metadata via PUT /api/v0/services/:serviceName/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/services/foo/metadata/abc", handler);
      const client = new ServicesApiClient(fetcher);

      await client.putMetadata("foo", "abc", { test: 42 });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, { test: 42 });
    });
  });

  describe("#deleteMetadata", () => {
    it("deletes Service metadata via DELETE /api/v0/services/:serviceName/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/services/foo/metadata/abc", handler);
      const client = new ServicesApiClient(fetcher);

      await client.deleteMetadata("foo", "abc");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});
    });
  });

  describe("#listRoleMetadataNamespaces", () => {
    it("lists Role metadata namespaces via GET /api/v0/services/:serviceName/roles/:roleName/metadata", async () => {
      const handler = spy((_?: FetchOptions) => ({
        metadata: [
          { namespace: "abc" },
          { namespace: "def" },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/services/foo/roles/xxx/metadata", handler);
      const client = new ServicesApiClient(fetcher);

      const namespaces = await client.listRoleMetadataNamespaces("foo:xxx");

      assertSpyCalls(handler, 1);

      assertEquals(namespaces, ["abc", "def"]);
    });
  });

  describe("#getRoleMetadata", () => {
    it("lists Role metadata via GET /api/v0/services/:serviceName/roles/:roleName/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ test: 42 }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/services/foo/roles/xxx/metadata/abc", handler);
      const client = new ServicesApiClient(fetcher);

      const metadata = await client.getRoleMetadata("foo:xxx", "abc");

      assertSpyCalls(handler, 1);

      assertEquals(metadata, { test: 42 });
    });
  });

  describe("#putRoleMetadata", () => {
    it("puts Role metadata via PUT /api/v0/services/:serviceName/roles/:roleName/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/services/foo/roles/xxx/metadata/abc", handler);
      const client = new ServicesApiClient(fetcher);

      await client.putRoleMetadata("foo:xxx", "abc", { test: 42 });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, { test: 42 });
    });
  });

  describe("#deleteRoleMetadata", () => {
    it("deletes Role metadata via DELETE /api/v0/services/:serviceName/roles/:roleName/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/services/foo/roles/xxx/metadata/abc", handler);
      const client = new ServicesApiClient(fetcher);

      await client.deleteRoleMetadata("foo:xxx", "abc");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});
    });
  });
});

describe("parseRoleFullname", () => {
  it("parses a role fullname", () => {
    assertEquals(parseRoleFullname("foo:bar"), ["foo", "bar"]);
    assertEquals(parseRoleFullname("baz: qux"), ["baz", "qux"]);
  });

  it("throws if role fullname is invalid", () => {
    assertThrows(() => parseRoleFullname("foo"), SyntaxError);
    assertThrows(() => parseRoleFullname("foo:bar:baz"), SyntaxError);
  });
});

describe("makeRoleFullname", () => {
  it("makes a role fullname", () => {
    assertEquals(makeRoleFullname("foo", "bar"), "foo:bar");
  });
});
