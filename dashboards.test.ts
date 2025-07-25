import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { DashboardsApiClient } from "./dashboards.ts";

describe("DashboardsApiClient", () => {
  describe("#list", () => {
    it("lists Dashboards via GET /api/v0/dashboards", async () => {
      const handler = spy((_?: FetchOptions) => ({
        dashboards: [
          {
            id: "dashboaord-0",
            title: "my dashboard",
            memo: "test",
            urlPath: "my-dashboard",
            widgets: [
              {
                title: "Hello",
                layout: { x: 0, y: 0, width: 6, height: 4 },
                type: "markdown",
                markdown: "# Hello",
              },
            ],
            createdAt: 1717677296,
            updatedAt: 1720355696,
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/dashboards", handler);
      const client = new DashboardsApiClient(fetcher);

      const dashboards = await client.list();

      assertSpyCalls(handler, 1);

      assertEquals(dashboards, [{
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: new Date("2024-06-06T12:34:56Z"),
        updatedAt: new Date("2024-07-07T12:34:56Z"),
      }]);
    });
  });

  describe("#get", () => {
    it("gets a Dashboard via GET /api/v0/dashboards/:dashboardId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: 1717677296,
        updatedAt: 1720355696,
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/dashboards/dashboard-0", handler);
      const client = new DashboardsApiClient(fetcher);

      const dashboard = await client.get("dashboard-0");

      assertSpyCalls(handler, 1);

      assertEquals(dashboard, {
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: new Date("2024-06-06T12:34:56Z"),
        updatedAt: new Date("2024-07-07T12:34:56Z"),
      });
    });
  });

  describe("#create", () => {
    it("creates a Dashboard via POST /api/v0/dashboards", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: 1717677296,
        updatedAt: 1720355696,
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/dashboards", handler);
      const client = new DashboardsApiClient(fetcher);

      const dashboard = await client.create({
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
      });

      assertEquals(dashboard, {
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: new Date("2024-06-06T12:34:56Z"),
        updatedAt: new Date("2024-07-07T12:34:56Z"),
      });
    });
  });

  describe("#update", () => {
    it("updates a Dashboard via PUT /api/v0/dashboards/:dashboardId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: 1717677296,
        updatedAt: 1720355696,
      }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/dashboards/dashboard-0", handler);
      const client = new DashboardsApiClient(fetcher);

      const dashboard = await client.update("dashboard-0", {
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
      });

      assertEquals(dashboard, {
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: new Date("2024-06-06T12:34:56Z"),
        updatedAt: new Date("2024-07-07T12:34:56Z"),
      });
    });
  });

  describe("#delete", () => {
    it("deletes a Dashboard via DELETE /api/v0/dashboards/:dashboardId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: 1717677296,
        updatedAt: 1720355696,
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/dashboards/dashboard-0", handler);
      const client = new DashboardsApiClient(fetcher);

      const dashboard = await client.delete("dashboard-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(dashboard, {
        id: "dashboaord-0",
        title: "my dashboard",
        memo: "test",
        urlPath: "my-dashboard",
        widgets: [
          {
            title: "Hello",
            layout: { x: 0, y: 0, width: 6, height: 4 },
            type: "markdown",
            markdown: "# Hello",
          },
        ],
        createdAt: new Date("2024-06-06T12:34:56Z"),
        updatedAt: new Date("2024-07-07T12:34:56Z"),
      });
    });
  });
});
