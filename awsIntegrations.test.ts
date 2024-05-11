import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import type { FetchOptions } from "./fetcher.ts";
import { MockFetcher } from "./fetcher.ts";
import { AwsIntegrationsApiClient } from "./awsIntegrations.ts";

describe("AwsIntegrationsApiClient", () => {
  describe("#list", () => {
    it("lists AwsIntegrations via GET /api/v0/aws-integrations", async () => {
      const handler = spy((_?: FetchOptions) => ({
        aws_integrations: [
          {
            id: "integration-0",
            name: "my integration",
            memo: "test",
            roleArn: "test-roleArn",
            externalId: "test-externalId",
            region: "ap-northeast-1",
            includedTags: "test:include",
            excludedTags: "test:exclude",
            services: {
              "EC2": {
                enable: true,
                retireAutomatically: true,
                role: "foo:xxx",
                excludedMetrics: ["test-metric"],
              },
              "ALB": {
                enable: false,
                role: null,
                excludedMetrics: [],
              },
            },
          },
        ],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/aws-integrations", handler);
      const cli = new AwsIntegrationsApiClient(fetcher);

      const integrations = await cli.list();

      assertSpyCalls(handler, 1);

      assertEquals(integrations, [
        {
          id: "integration-0",
          name: "my integration",
          memo: "test",
          auth: {
            type: "assumeRole",
            roleArn: "test-roleArn",
            externalId: "test-externalId",
          },
          region: "ap-northeast-1",
          tags: {
            include: "test:include",
            exclude: "test:exclude",
          },
          services: [
            {
              roleFullname: "foo:xxx",
              metrics: {
                type: "exclude",
                names: ["test-metric"],
              },
              type: "EC2",
              retireAutomatically: true,
            },
          ],
        },
      ]);
    });
  });

  describe("#get", () => {
    it("gets an AwsIntegration via GET /api/v0/aws-integrations/:integrationId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "integration-0",
        name: "my integration",
        memo: "test",
        roleArn: "test-roleArn",
        externalId: "test-externalId",
        region: "ap-northeast-1",
        includedTags: "test:include",
        excludedTags: "test:exclude",
        services: {
          "EC2": {
            enable: true,
            retireAutomatically: true,
            role: "foo:xxx",
            excludedMetrics: ["test-metric"],
          },
          "ALB": {
            enable: false,
            role: null,
            excludedMetrics: [],
          },
        },
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/aws-integrations/integration-0", handler);
      const cli = new AwsIntegrationsApiClient(fetcher);

      const integration = await cli.get("integration-0");

      assertSpyCalls(handler, 1);

      assertEquals(integration, {
        id: "integration-0",
        name: "my integration",
        memo: "test",
        auth: {
          type: "assumeRole",
          roleArn: "test-roleArn",
          externalId: "test-externalId",
        },
        region: "ap-northeast-1",
        tags: {
          include: "test:include",
          exclude: "test:exclude",
        },
        services: [
          {
            roleFullname: "foo:xxx",
            metrics: {
              type: "exclude",
              names: ["test-metric"],
            },
            type: "EC2",
            retireAutomatically: true,
          },
        ],
      });
    });
  });

  describe("#create", () => {
    it("creates an AwsIntegration via POST /api/v0/aws-integrations", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "integration-0",
        name: "my integration",
        memo: "test",
        roleArn: "test-roleArn",
        externalId: "test-externalId",
        region: "ap-northeast-1",
        includedTags: "test:include",
        excludedTags: "test:exclude",
        services: {
          "EC2": {
            enable: true,
            retireAutomatically: true,
            role: "foo:xxx",
            excludedMetrics: ["test-metric"],
          },
          "ALB": {
            enable: false,
            role: null,
            excludedMetrics: [],
          },
        },
      }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/aws-integrations", handler);
      const cli = new AwsIntegrationsApiClient(fetcher);

      const integration = await cli.create({
        name: "my integration",
        memo: "test",
        auth: {
          type: "assumeRole",
          roleArn: "test-roleArn",
          externalId: "test-externalId",
        },
        region: "ap-northeast-1",
        tags: {
          include: "test:include",
          exclude: "test:exclude",
        },
        services: [
          {
            roleFullname: "foo:xxx",
            metrics: {
              type: "exclude",
              names: ["test-metric"],
            },
            type: "EC2",
            retireAutomatically: true,
          },
        ],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my integration",
        memo: "test",
        key: null,
        secretKey: null,
        roleArn: "test-roleArn",
        externalId: "test-externalId",
        region: "ap-northeast-1",
        includedTags: "test:include",
        excludedTags: "test:exclude",
        services: {
          "EC2": {
            enable: true,
            retireAutomatically: true,
            role: "foo:xxx",
            includedMetrics: undefined,
            excludedMetrics: ["test-metric"],
          },
        },
      });

      assertEquals(integration, {
        id: "integration-0",
        name: "my integration",
        memo: "test",
        auth: {
          type: "assumeRole",
          roleArn: "test-roleArn",
          externalId: "test-externalId",
        },
        region: "ap-northeast-1",
        tags: {
          include: "test:include",
          exclude: "test:exclude",
        },
        services: [
          {
            roleFullname: "foo:xxx",
            metrics: {
              type: "exclude",
              names: ["test-metric"],
            },
            type: "EC2",
            retireAutomatically: true,
          },
        ],
      });
    });
  });

  describe("#update", () => {
    it("updates an AwsIntegration via PUT /api/v0/aws-integrations/:integrationId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "integration-0",
        name: "my integration",
        memo: "test",
        roleArn: "test-roleArn",
        externalId: "test-externalId",
        region: "ap-northeast-1",
        includedTags: "test:include",
        excludedTags: "test:exclude",
        services: {
          "EC2": {
            enable: true,
            retireAutomatically: true,
            role: "foo:xxx",
            excludedMetrics: ["test-metric"],
          },
          "ALB": {
            enable: false,
            role: null,
            excludedMetrics: [],
          },
        },
      }));
      const fetcher = new MockFetcher()
        .mock("PUT", "/api/v0/aws-integrations/integration-0", handler);
      const cli = new AwsIntegrationsApiClient(fetcher);

      const integration = await cli.update("integration-0", {
        name: "my integration",
        memo: "test",
        region: "ap-northeast-1",
        tags: {
          include: "test:include",
          exclude: "test:exclude",
        },
        services: [
          {
            roleFullname: "foo:xxx",
            metrics: {
              type: "exclude",
              names: ["test-metric"],
            },
            type: "EC2",
            retireAutomatically: true,
          },
        ],
      });

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {
        name: "my integration",
        memo: "test",
        key: undefined,
        secretKey: undefined,
        roleArn: undefined,
        externalId: undefined,
        region: "ap-northeast-1",
        includedTags: "test:include",
        excludedTags: "test:exclude",
        services: {
          "EC2": {
            enable: true,
            retireAutomatically: true,
            role: "foo:xxx",
            includedMetrics: undefined,
            excludedMetrics: ["test-metric"],
          },
        },
      });

      assertEquals(integration, {
        id: "integration-0",
        name: "my integration",
        memo: "test",
        auth: {
          type: "assumeRole",
          roleArn: "test-roleArn",
          externalId: "test-externalId",
        },
        region: "ap-northeast-1",
        tags: {
          include: "test:include",
          exclude: "test:exclude",
        },
        services: [
          {
            roleFullname: "foo:xxx",
            metrics: {
              type: "exclude",
              names: ["test-metric"],
            },
            type: "EC2",
            retireAutomatically: true,
          },
        ],
      });
    });
  });

  describe("#delete", () => {
    it("deletes an AwsIntegration via DELETE /api/v0/aws-integrations/:integrationId", async () => {
      const handler = spy((_?: FetchOptions) => ({
        id: "integration-0",
        name: "my integration",
        memo: "test",
        roleArn: "test-roleArn",
        externalId: "test-externalId",
        region: "ap-northeast-1",
        includedTags: "test:include",
        excludedTags: "test:exclude",
        services: {
          "EC2": {
            enable: true,
            retireAutomatically: true,
            role: "foo:xxx",
            excludedMetrics: ["test-metric"],
          },
          "ALB": {
            enable: false,
            role: null,
            excludedMetrics: [],
          },
        },
      }));
      const fetcher = new MockFetcher()
        .mock("DELETE", "/api/v0/aws-integrations/integration-0", handler);
      const cli = new AwsIntegrationsApiClient(fetcher);

      const integration = await cli.delete("integration-0");

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(integration, {
        id: "integration-0",
        name: "my integration",
        memo: "test",
        auth: {
          type: "assumeRole",
          roleArn: "test-roleArn",
          externalId: "test-externalId",
        },
        region: "ap-northeast-1",
        tags: {
          include: "test:include",
          exclude: "test:exclude",
        },
        services: [
          {
            roleFullname: "foo:xxx",
            metrics: {
              type: "exclude",
              names: ["test-metric"],
            },
            type: "EC2",
            retireAutomatically: true,
          },
        ],
      });
    });
  });

  describe("#createExternalId", () => {
    it("creates an external ID via POST /api/v0/aws-integrations-external-id", async () => {
      const handler = spy((_?: FetchOptions) => ({ externalId: "test-externalId" }));
      const fetcher = new MockFetcher()
        .mock("POST", "/api/v0/aws-integrations-external-id", handler);
      const cli = new AwsIntegrationsApiClient(fetcher);

      const externalId = await cli.createExternalId();

      assertSpyCalls(handler, 1);
      const body = handler.calls[0].args[0]?.body;
      assertEquals(body, {});

      assertEquals(externalId, "test-externalId");
    });
  });

  describe("#listMetricNames", () => {
    it("list metric names via GET /api/v0/aws-integrations-excludable-metrics", async () => {
      const handler = spy((_?: FetchOptions) => ({
        EC2: ["abc", "def"],
        ALB: ["ghi", "jkl"],
      }));
      const fetcher = new MockFetcher()
        .mock("GET", "/api/v0/aws-integrations-excludable-metrics", handler);
      const cli = new AwsIntegrationsApiClient(fetcher);

      const metricNames = await cli.listMetricNames();

      assertSpyCalls(handler, 1);

      assertEquals(
        metricNames,
        new Map([
          ["EC2", ["abc", "def"]],
          ["ALB", ["ghi", "jkl"]],
        ]),
      );
    });
  });
});
