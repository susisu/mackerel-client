import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { GraphAnnotationsApiClient } from "./graphAnnotations.ts";

describe("GraphAnnotationsApiClient", () => {
  describe("#list", () => {
    it("lists GraphAnnotations via GET /api/v0/graph-annotations", async () => {
      const handler = spy((_?: FetchOptions) => ({
        graphAnnotations: [
          {
            id: "annotation-0",
            title: "my annotation 1",
            description: "test",
            from: 1717677296,
            to: 1717680896,
            service: "foo",
            roles: ["xxx"],
          },
          {
            id: "annotation-2",
            title: "my annotation 2",
            description: "",
            from: 1717720496,
            to: 1717724096,
            service: "foo",
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/graph-annotations", handler);
      const cli = new GraphAnnotationsApiClient(fetcher);

      const annotations = await cli.list("foo", {
        from: new Date("2024-06-06T12:00:00Z"),
        to: new Date("2024-06-07T12:00:00Z"),
      });

      assertSpyCalls(handler, 1);
      const params = handler.calls[0].args[0]?.params;
      assertEquals(
        params,
        new URLSearchParams({
          service: "foo",
          from: "1717675200",
          to: "1717761600",
        }),
      );

      assertEquals(annotations, [
        {
          id: "annotation-0",
          title: "my annotation 1",
          description: "test",
          from: new Date("2024-06-06T12:34:56Z"),
          to: new Date("2024-06-06T13:34:56Z"),
          serviceName: "foo",
          roleNames: ["xxx"],
        },
        {
          id: "annotation-2",
          title: "my annotation 2",
          description: "",
          from: new Date("2024-06-07T00:34:56Z"),
          to: new Date("2024-06-07T01:34:56Z"),
          serviceName: "foo",
          roleNames: [],
        },
      ]);
    });
  });

  describe("#create", () => {
    it("creates a GraphAnnotations via POST /api/v0/graph-annotations", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "annotation-0",
        title: "my annotation",
        description: "test",
        from: 1717677296,
        to: 1717680896,
        service: "foo",
        roles: ["xxx"],
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/graph-annotations", handler);
      const cli = new GraphAnnotationsApiClient(fetcher);

      const annotation = await cli.create({
        title: "my annotation",
        description: "test",
        from: new Date("2024-06-06T12:34:56Z"),
        to: new Date("2024-06-06T13:34:56Z"),
        serviceName: "foo",
        roleNames: ["xxx"],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(
        body,
        {
          title: "my annotation",
          description: "test",
          from: 1717677296,
          to: 1717680896,
          service: "foo",
          roles: ["xxx"],
        },
      );

      assertEquals(annotation, {
        id: "annotation-0",
        title: "my annotation",
        description: "test",
        from: new Date("2024-06-06T12:34:56Z"),
        to: new Date("2024-06-06T13:34:56Z"),
        serviceName: "foo",
        roleNames: ["xxx"],
      });
    });
  });

  describe("#update", () => {
    it("updates a GraphAnnotations via PUT /api/v0/graph-annotations/:annotationId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "annotation-0",
        title: "my annotation",
        description: "test",
        from: 1717677296,
        to: 1717680896,
        service: "foo",
        roles: ["xxx"],
      }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/graph-annotations/annotation-0", handler);
      const cli = new GraphAnnotationsApiClient(fetcher);

      const annotation = await cli.update("annotation-0", {
        title: "my annotation",
        description: "test",
        from: new Date("2024-06-06T12:34:56Z"),
        to: new Date("2024-06-06T13:34:56Z"),
        serviceName: "foo",
        roleNames: ["xxx"],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(
        body,
        {
          title: "my annotation",
          description: "test",
          from: 1717677296,
          to: 1717680896,
          service: "foo",
          roles: ["xxx"],
        },
      );

      assertEquals(annotation, {
        id: "annotation-0",
        title: "my annotation",
        description: "test",
        from: new Date("2024-06-06T12:34:56Z"),
        to: new Date("2024-06-06T13:34:56Z"),
        serviceName: "foo",
        roleNames: ["xxx"],
      });
    });
  });

  describe("#delete", () => {
    it("deletes a GraphAnnotations via DELETE /api/v0/graph-annotations/:annotationId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "annotation-0",
        title: "my annotation",
        description: "test",
        from: 1717677296,
        to: 1717680896,
        service: "foo",
        roles: ["xxx"],
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/graph-annotations/annotation-0", handler);
      const cli = new GraphAnnotationsApiClient(fetcher);

      const annotation = await cli.delete("annotation-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(annotation, {
        id: "annotation-0",
        title: "my annotation",
        description: "test",
        from: new Date("2024-06-06T12:34:56Z"),
        to: new Date("2024-06-06T13:34:56Z"),
        serviceName: "foo",
        roleNames: ["xxx"],
      });
    });
  });
});
