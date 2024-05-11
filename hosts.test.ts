import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { HostsApiClient } from "./hosts.ts";

describe("HostsApiClient", () => {
  describe("#list", () => {
    it("lists Hosts via GET /api/v0/hosts", async () => {
      const handler = spy((_?: FetchOptions) => ({
        hosts: [
          {
            id: "host-0",
            createdAt: 1717677296,
            name: "myhost",
            displayName: "MyHost",
            customIdentifier: "myhost-0",
            memo: "test",
            meta: { data: 42 },
            size: "standard",
            status: "working",
            isRetired: false,
            interfaces: [
              {
                name: "myinterface1",
                macAddress: "xxx",
                ipv4Addresses: ["xxx.xxx.xxx.xxx"],
                ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
                ipAddress: "xxx.xxx.xxx",
                ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
              },
              {
                name: "myinterface2",
              },
            ],
            roles: {
              foo: ["xxx", "yyy"],
              bar: ["zzz"],
            },
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/hosts", handler);
      const cli = new HostsApiClient(fetcher);

      const hosts = await cli.list({
        serviceName: "foo",
        roleNames: ["xxx", "yyy"],
        name: "myhost",
        customIdentifier: "myhost-0",
        statuses: ["working", "standby"],
      });

      assertSpyCalls(handler, 1);
      const params = handler.calls[0].args[0]?.params;
      assertEquals(
        params,
        new URLSearchParams([
          ["service", "foo"],
          ["role", "xxx"],
          ["role", "yyy"],
          ["name", "myhost"],
          ["customIdentifier", "myhost-0"],
          ["status", "working"],
          ["status", "standby"],
        ]),
      );

      assertEquals(hosts, [{
        id: "host-0",
        createdAt: new Date("2024-06-06T12:34:56Z"),
        name: "myhost",
        displayName: "MyHost",
        customIdentifier: "myhost-0",
        memo: "test",
        meta: { data: 42 },
        size: "standard",
        status: "working",
        isRetired: false,
        retiredAt: undefined,
        interfaces: [
          {
            name: "myinterface1",
            macAddress: "xxx",
            ipv4Addresses: ["xxx.xxx.xxx.xxx"],
            ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
            ipAddress: "xxx.xxx.xxx",
            ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
          },
          {
            name: "myinterface2",
            macAddress: undefined,
            ipv4Addresses: [],
            ipv6Addresses: [],
            ipAddress: undefined,
            ipv6Address: undefined,
          },
        ],
        roleFullnames: ["foo:xxx", "foo:yyy", "bar:zzz"],
      }]);
    });
  });

  describe("#get", () => {
    it("gets a Host via GET /api/v0/hosts/:hostId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        host: {
          id: "host-0",
          createdAt: 1717677296,
          name: "myhost",
          displayName: "MyHost",
          customIdentifier: "myhost-0",
          memo: "test",
          meta: { data: 42 },
          size: "standard",
          status: "working",
          isRetired: false,
          interfaces: [
            {
              name: "myinterface1",
              macAddress: "xxx",
              ipv4Addresses: ["xxx.xxx.xxx.xxx"],
              ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
              ipAddress: "xxx.xxx.xxx",
              ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
            },
            {
              name: "myinterface2",
            },
          ],
          roles: {
            foo: ["xxx", "yyy"],
            bar: ["zzz"],
          },
        },
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/hosts/host-0", handler);
      const cli = new HostsApiClient(fetcher);

      const host = await cli.get("host-0");

      assertSpyCalls(handler, 1);

      assertEquals(host, {
        id: "host-0",
        createdAt: new Date("2024-06-06T12:34:56Z"),
        name: "myhost",
        displayName: "MyHost",
        customIdentifier: "myhost-0",
        memo: "test",
        meta: { data: 42 },
        size: "standard",
        status: "working",
        isRetired: false,
        retiredAt: undefined,
        interfaces: [
          {
            name: "myinterface1",
            macAddress: "xxx",
            ipv4Addresses: ["xxx.xxx.xxx.xxx"],
            ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
            ipAddress: "xxx.xxx.xxx",
            ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
          },
          {
            name: "myinterface2",
            macAddress: undefined,
            ipv4Addresses: [],
            ipv6Addresses: [],
            ipAddress: undefined,
            ipv6Address: undefined,
          },
        ],
        roleFullnames: ["foo:xxx", "foo:yyy", "bar:zzz"],
      });
    });
  });

  describe("#getByCustomIdentifier", () => {
    it("gets a Host via GET /api/v0/hosts-by-custom-identifier/:customIdentifier", async () => {
      const handler = spy((_?: FetchOptions) => ({
        host: {
          id: "host-0",
          createdAt: 1717677296,
          name: "myhost",
          displayName: "MyHost",
          customIdentifier: "myhost-0",
          memo: "test",
          meta: { data: 42 },
          size: "standard",
          status: "working",
          isRetired: false,
          interfaces: [
            {
              name: "myinterface1",
              macAddress: "xxx",
              ipv4Addresses: ["xxx.xxx.xxx.xxx"],
              ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
              ipAddress: "xxx.xxx.xxx",
              ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
            },
            {
              name: "myinterface2",
            },
          ],
          roles: {
            foo: ["xxx", "yyy"],
            bar: ["zzz"],
          },
        },
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/hosts-by-custom-identifier/myhost-0", handler);
      const cli = new HostsApiClient(fetcher);

      const host = await cli.getByCustomIdentifier("myhost-0");

      assertSpyCalls(handler, 1);

      assertEquals(host, {
        id: "host-0",
        createdAt: new Date("2024-06-06T12:34:56Z"),
        name: "myhost",
        displayName: "MyHost",
        customIdentifier: "myhost-0",
        memo: "test",
        meta: { data: 42 },
        size: "standard",
        status: "working",
        isRetired: false,
        retiredAt: undefined,
        interfaces: [
          {
            name: "myinterface1",
            macAddress: "xxx",
            ipv4Addresses: ["xxx.xxx.xxx.xxx"],
            ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
            ipAddress: "xxx.xxx.xxx",
            ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
          },
          {
            name: "myinterface2",
            macAddress: undefined,
            ipv4Addresses: [],
            ipv6Addresses: [],
            ipAddress: undefined,
            ipv6Address: undefined,
          },
        ],
        roleFullnames: ["foo:xxx", "foo:yyy", "bar:zzz"],
      });
    });
  });

  describe("create", () => {
    it("creates a Host via POST /api/v0/hosts", async () => {
      const handler = spy((_?: FetchOptions) => ({ id: "host-0" }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/hosts", handler);
      const cli = new HostsApiClient(fetcher);

      const res = await cli.create({
        name: "myhost",
        displayName: "MyHost",
        customIdentifier: "myhost-0",
        memo: "test",
        meta: { data: 42 },
        interfaces: [
          {
            name: "myinterface1",
            macAddress: "xxx",
            ipv4Addresses: ["xxx.xxx.xxx.xxx"],
            ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
            ipAddress: "xxx.xxx.xxx",
            ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
          },
          {
            name: "myinterface2",
          },
        ],
        roleFullnames: ["foo:xxx", "foo:yyy", "bar:zzz"],
        checks: [{ name: "check1", memo: "Check" }],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "myhost",
        displayName: "MyHost",
        customIdentifier: "myhost-0",
        memo: "test",
        meta: { data: 42 },
        interfaces: [
          {
            name: "myinterface1",
            macAddress: "xxx",
            ipv4Addresses: ["xxx.xxx.xxx.xxx"],
            ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
            ipAddress: "xxx.xxx.xxx",
            ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
          },
          {
            name: "myinterface2",
          },
        ],
        roleFullnames: ["foo:xxx", "foo:yyy", "bar:zzz"],
        checks: [{ name: "check1", memo: "Check" }],
      });

      assertEquals(res, { id: "host-0" });
    });
  });

  describe("#update", () => {
    it("updates a Host via PUT /api/v0/hosts/:hostId", async () => {
      const handler = spy((_?: FetchOptions) => ({ id: "host-0" }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/hosts/host-0", handler);
      const cli = new HostsApiClient(fetcher);

      await cli.update("host-0", {
        name: "myhost",
        displayName: "MyHost",
        customIdentifier: "myhost-0",
        memo: "test",
        meta: { data: 42 },
        interfaces: [
          {
            name: "myinterface1",
            macAddress: "xxx",
            ipv4Addresses: ["xxx.xxx.xxx.xxx"],
            ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
            ipAddress: "xxx.xxx.xxx",
            ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
          },
          {
            name: "myinterface2",
          },
        ],
        roleFullnames: ["foo:xxx", "foo:yyy", "bar:zzz"],
        checks: [{ name: "check1", memo: "Check" }],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "myhost",
        displayName: "MyHost",
        customIdentifier: "myhost-0",
        memo: "test",
        meta: { data: 42 },
        interfaces: [
          {
            name: "myinterface1",
            macAddress: "xxx",
            ipv4Addresses: ["xxx.xxx.xxx.xxx"],
            ipv6Addresses: ["xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx"],
            ipAddress: "xxx.xxx.xxx",
            ipv6Address: "xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx",
          },
          {
            name: "myinterface2",
          },
        ],
        roleFullnames: ["foo:xxx", "foo:yyy", "bar:zzz"],
        checks: [{ name: "check1", memo: "Check" }],
      });
    });
  });

  describe("#updateStatus", () => {
    it("updates status of a Host via POST /api/v0/hosts/:hostId/status", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/hosts/host-0/status", handler);
      const cli = new HostsApiClient(fetcher);

      await cli.updateStatus("host-0", "standby");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, { status: "standby" });
    });
  });

  describe("#bulkUpdateStatuses", () => {
    it("updates statuses of Hosts via POST /api/v0/hosts/bulk-update-statuses", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/hosts/bulk-update-statuses", handler);
      const cli = new HostsApiClient(fetcher);

      await cli.bulkUpdateStatuses(["host-0", "host-1"], "standby");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        ids: ["host-0", "host-1"],
        status: "standby",
      });
    });
  });

  describe("#updateRoles", () => {
    it("updates roles of a Host via PUT /api/v0/hosts/:hostId/role-fullnames", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/hosts/host-0/role-fullnames", handler);
      const cli = new HostsApiClient(fetcher);

      await cli.updateRoles("host-0", ["foo:xxx", "bar:yyy"]);

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, { roleFullnames: ["foo:xxx", "bar:yyy"] });
    });
  });

  describe("#retire", () => {
    it("retires a Host via POST /api/v0/hosts/:hostId/retire", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/hosts/host-0/retire", handler);
      const cli = new HostsApiClient(fetcher);

      await cli.retire("host-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});
    });
  });

  describe("#bulkRetire", () => {
    it("retires Hosts via POST /api/v0/hosts/bulk-retire", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/hosts/bulk-retire", handler);
      const cli = new HostsApiClient(fetcher);

      await cli.bulkRetire(["host-0", "host-1"]);

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        ids: ["host-0", "host-1"],
      });
    });
  });

  describe("#listMonitoredStatuses", () => {
    it("lists monitored statuses of a Host via GET /api/v0/hosts/:hostId/monitored-statuses", async () => {
      const handler = spy((_?: FetchOptions) => ({
        monitoredStatuses: [
          {
            monitorId: "monitor-0",
            status: "OK",
            detail: {
              type: "check",
              message: "ok",
              memo: "test",
            },
          },
          {
            monitorId: "monitor-1",
            status: "CRITICAL",
            detail: {
              type: "check",
              message: "critical",
            },
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/hosts/host-0/monitored-statuses", handler);
      const cli = new HostsApiClient(fetcher);

      const statuses = await cli.listMonitoredStatuses("host-0");

      assertSpyCalls(handler, 1);

      assertEquals(statuses, [
        {
          monitorId: "monitor-0",
          status: "OK",
          detail: {
            type: "check",
            message: "ok",
            memo: "test",
          },
        },
        {
          monitorId: "monitor-1",
          status: "CRITICAL",
          detail: {
            type: "check",
            message: "critical",
            memo: "",
          },
        },
      ]);
    });
  });

  describe("#listMetadataNamespaces", () => {
    it("lists Host metadata namespaces via GET /api/v0/hosts/:hostId/metadata", async () => {
      const handler = spy((_?: FetchOptions) => ({
        metadata: [
          { namespace: "abc" },
          { namespace: "def" },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/hosts/host-0/metadata", handler);
      const cli = new HostsApiClient(fetcher);

      const namespaces = await cli.listMetadataNamespaces("host-0");

      assertSpyCalls(handler, 1);

      assertEquals(namespaces, ["abc", "def"]);
    });
  });

  describe("#getMetadata", () => {
    it("lists Host metadata via GET /api/v0/hosts/:hostId/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ test: 42 }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/hosts/host-0/metadata/abc", handler);
      const cli = new HostsApiClient(fetcher);

      const metadata = await cli.getMetadata("host-0", "abc");

      assertSpyCalls(handler, 1);

      assertEquals(metadata, { test: 42 });
    });
  });

  describe("#putMetadata", () => {
    it("puts Host metadata via PUT /api/v0/hosts/:hostId/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/hosts/host-0/metadata/abc", handler);
      const cli = new HostsApiClient(fetcher);

      await cli.putMetadata("host-0", "abc", { test: 42 });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, { test: 42 });
    });
  });

  describe("#deleteMetadata", () => {
    it("deletes Host metadata via DELETE /api/v0/hosts/:hostId/metadata/:namespace", async () => {
      const handler = spy((_?: FetchOptions) => ({ success: true }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/hosts/host-0/metadata/abc", handler);
      const cli = new HostsApiClient(fetcher);

      await cli.deleteMetadata("host-0", "abc");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});
    });
  });
});
