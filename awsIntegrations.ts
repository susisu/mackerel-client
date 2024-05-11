import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiOptions, Fetcher } from "./fetcher.ts";

assertType<
  Extends<
    AwsIntegration & { auth: { secretKey: string } },
    CreateAwsIntegrationInput
  >
>(true);

const awsServiceTypes = [
  "EC2",
  "ELB",
  "ALB",
  "NLB",
  "RDS",
  "Redshift",
  "ElastiCache",
  "SQS",
  "Lambda",
  "DynamoDB",
  "CloudFront",
  "APIGateway",
  "Kinesis",
  "S3",
  "ES",
  "ECSCluster",
  "SES",
  "States",
  "EFS",
  "Firehose",
  "Batch",
  "WAF",
  "Billing",
  "Route 53",
  "Connect",
  "DocDB",
  "CodeBuild",
] as const;

// deno-lint-ignore ban-types
type AwsServiceType = typeof awsServiceTypes[number] | (string & {});

const autoRetirementSupportedAwsServiceTypes = [
  "EC2",
  "RDS",
] as const;

type AwsAutoRetirementSupportedServiceType = typeof autoRetirementSupportedAwsServiceTypes[number];

function isAutoRetirementSupportedType(
  type: string,
): type is AwsAutoRetirementSupportedServiceType {
  return autoRetirementSupportedAwsServiceTypes.some((t) => t === type);
}

export type AwsIntegration = {
  id: string;
  name: string;
  memo: string;
  auth: AwsIntegrationAuth;
  region: string;
  tags: {
    include: string;
    exclude: string;
  };
  services: AwsIntegrationService[];
};

export type AwsIntegrationAuth =
  | AwsIntegrationAuthAccessKey
  | AwsIntegrationAuthAssumeRole;

export type AwsIntegrationAuthAccessKey = {
  type: "accessKey";
  accessKey: string;
};

export type AwsIntegrationAuthAssumeRole = {
  type: "assumeRole";
  roleArn: string;
  externalId: string | undefined;
};

export type AwsIntegrationService =
  | CommonAwsIntegrationService
  | AutoRetirementSupportedAwsIntegrationService;

type BaseAwsIntegrationService = {
  roleFullname: string | undefined;
  metrics: AwsIntegrationServiceMetrics;
};

export type CommonAwsIntegrationService = BaseAwsIntegrationService & {
  type: Exclude<AwsServiceType, AwsAutoRetirementSupportedServiceType>;
};

export type AutoRetirementSupportedAwsIntegrationService = BaseAwsIntegrationService & {
  type: AwsAutoRetirementSupportedServiceType;
  retireAutomatically: boolean;
};

export type AwsIntegrationServiceMetrics =
  | AwsIntegrationServiceMetricsInclude
  | AwsIntegrationServiceMetricsExclude;

export type AwsIntegrationServiceMetricsInclude = {
  type: "include";
  names: string[];
};

export type AwsIntegrationServiceMetricsExclude = {
  type: "exclude";
  names: string[];
};

export type CreateAwsIntegrationInput = Readonly<{
  name: string;
  memo?: string | undefined;
  auth: CreateAwsIntegrationInputAuth;
  region: string;
  tags?:
    | Readonly<{
      include?: string | undefined;
      exclude?: string | undefined;
    }>
    | undefined;
  services?: readonly CreateAwsIntegrationInputService[] | undefined;
}>;

export type CreateAwsIntegrationInputAuth =
  | CreateAwsIntegrationInputAuthAccessKey
  | CreateAwsIntegrationInputAuthAssumeRole;

export type CreateAwsIntegrationInputAuthAccessKey = Readonly<{
  type: "accessKey";
  accessKey: string;
  secretKey: string;
}>;

export type CreateAwsIntegrationInputAuthAssumeRole = Readonly<{
  type: "assumeRole";
  roleArn: string;
  externalId: string | undefined;
}>;

export type CreateAwsIntegrationInputService =
  | CreateAwsIntegrationInputCommonService
  | CreateAwsIntegrationInputAutoRetirementSupportedService;

type BaseCreateAwsIntegrationInputService = Readonly<{
  roleFullname?: string | undefined;
  metrics?: CreateAwsIntegrationInputServiceMetrics | undefined;
}>;

export type CreateAwsIntegrationInputCommonService =
  & BaseCreateAwsIntegrationInputService
  & Readonly<{
    type: Exclude<AwsServiceType, AwsAutoRetirementSupportedServiceType>;
  }>;

export type CreateAwsIntegrationInputAutoRetirementSupportedService =
  & BaseCreateAwsIntegrationInputService
  & Readonly<{
    type: AwsAutoRetirementSupportedServiceType;
    retireAutomatically?: boolean | undefined;
  }>;

export type CreateAwsIntegrationInputServiceMetrics =
  | CreateAwsIntegrationInputServiceMetricsInclude
  | CreateAwsIntegrationInputServiceMetricsExclude;

export type CreateAwsIntegrationInputServiceMetricsInclude = Readonly<{
  type: "include";
  names: string[];
}>;

export type CreateAwsIntegrationInputServiceMetricsExclude = Readonly<{
  type: "exclude";
  names: string[];
}>;

export type UpdateAwsIntegrationInput = Readonly<{
  name: string;
  memo?: string | undefined;
  auth?: CreateAwsIntegrationInputAuth | undefined;
  region: string;
  tags?:
    | Readonly<{
      include?: string | undefined;
      exclude?: string | undefined;
    }>
    | undefined;
  services?: readonly CreateAwsIntegrationInputService[] | undefined;
}>;

export class AwsIntegrationsApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async list(options?: ApiOptions): Promise<AwsIntegration[]> {
    const res = await this.fetcher.fetch<{ aws_integrations: RawAwsIntegration[] }>(
      "GET",
      "/api/v0/aws-integrations",
      { signal: options?.signal },
    );
    return res.aws_integrations.map((integration) => fromRawAwsIntegration(integration));
  }

  async get(integrationId: string, options?: ApiOptions): Promise<AwsIntegration> {
    const res = await this.fetcher.fetch<RawAwsIntegration>(
      "GET",
      `/api/v0/aws-integrations/${integrationId}`,
      { signal: options?.signal },
    );
    return fromRawAwsIntegration(res);
  }

  async create(input: CreateAwsIntegrationInput, options?: ApiOptions): Promise<AwsIntegration> {
    const res = await this.fetcher.fetch<RawAwsIntegration, RawCreateAwsIntegrationInput>(
      "POST",
      "/api/v0/aws-integrations",
      {
        body: toRawCreateAwsIntegrationInput(input),
        signal: options?.signal,
      },
    );
    return fromRawAwsIntegration(res);
  }

  async update(
    integrationId: string,
    input: UpdateAwsIntegrationInput,
    options?: ApiOptions,
  ): Promise<AwsIntegration> {
    const res = await this.fetcher.fetch<RawAwsIntegration, RawCreateAwsIntegrationInput>(
      "PUT",
      `/api/v0/aws-integrations/${integrationId}`,
      {
        body: toRawUpdateAwsIntegrationInput(input),
        signal: options?.signal,
      },
    );
    return fromRawAwsIntegration(res);
  }

  async delete(integrationId: string, options?: ApiOptions): Promise<AwsIntegration> {
    const res = await this.fetcher.fetch<RawAwsIntegration>(
      "DELETE",
      `/api/v0/aws-integrations/${integrationId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawAwsIntegration(res);
  }

  async createExternalId(options?: ApiOptions): Promise<string> {
    const res = await this.fetcher.fetch<{ externalId: string }>(
      "POST",
      "/api/v0/aws-integrations-external-id",
      { signal: options?.signal },
    );
    return res.externalId;
  }

  async listMetricNames(options?: ApiOptions): Promise<{ [K in AwsServiceType]: string[] }> {
    const res = await this.fetcher.fetch<{ [K in AwsServiceType]: string[] }>(
      "GET",
      "/api/v0/aws-integrations-excludable-metrics",
      { signal: options?.signal },
    );
    return res;
  }
}

type RawAwsIntegration =
  & {
    id: string;
    name: string;
    memo: string;
    externalId: string | null;
    region: string;
    includedTags: string;
    excludedTags: string;
    services: { [type: string]: RawAwsIntegrationService };
  }
  & ({
    key: string;
    roleArn: null;
  } | {
    key: null;
    roleArn: string;
  });

type RawAwsIntegrationService =
  & {
    enable: boolean;
    retireAutomatically?: boolean | null | undefined;
    role?: string | null | undefined;
  }
  & ({
    includedMetrics: string[];
    excludedMetrics?: undefined;
  } | {
    includedMetrics?: undefined;
    excludedMetrics: string[];
  });

function fromRawAwsIntegration(raw: RawAwsIntegration): AwsIntegration {
  return {
    id: raw.id,
    name: raw.name,
    memo: raw.memo,
    auth: typeof raw.roleArn === "string"
      ? {
        type: "assumeRole",
        roleArn: raw.roleArn,
        externalId: raw.externalId ?? undefined,
      }
      : {
        type: "accessKey",
        accessKey: raw.key,
      },
    region: raw.region,
    tags: {
      include: raw.includedTags,
      exclude: raw.excludedTags,
    },
    services: Object.entries(raw.services)
      .filter(([, service]) => service.enable)
      .map(([type, service]) => fromRawAwsIntegrationService(type, service)),
  };
}

function fromRawAwsIntegrationService(
  type: AwsServiceType,
  raw: RawAwsIntegrationService,
): AwsIntegrationService {
  const base: BaseAwsIntegrationService = {
    roleFullname: raw.role ?? undefined,
    metrics: raw.includedMetrics
      ? { type: "include", names: raw.includedMetrics }
      : { type: "exclude", names: raw.excludedMetrics },
  };
  if (isAutoRetirementSupportedType(type)) {
    return {
      ...base,
      type,
      // raw.retireAutomatically should exist
      retireAutomatically: raw.retireAutomatically ?? false,
    };
  } else {
    return {
      ...base,
      type,
    };
  }
}

type RawCreateAwsIntegrationInput = Readonly<{
  name: string;
  memo: string;
  key?: string | null | undefined;
  secretKey?: string | null | undefined;
  roleArn?: string | null | undefined;
  externalId?: string | null | undefined;
  region: string;
  includedTags: string;
  excludedTags: string;
  services: { readonly [type: string]: RawCreateAwsIntegrationInputService | undefined };
}>;

type RawCreateAwsIntegrationInputService = Readonly<{
  enable: boolean;
  retireAutomatically?: boolean | undefined;
  role: string | null;
  includedMetrics?: string[] | undefined;
  excludedMetrics?: string[] | undefined;
}>;

function toRawCreateAwsIntegrationInput(
  input: CreateAwsIntegrationInput,
): RawCreateAwsIntegrationInput {
  return {
    name: input.name,
    memo: input.memo ?? "",
    key: input.auth.type === "accessKey" ? input.auth.accessKey : null,
    secretKey: input.auth.type === "accessKey" ? input.auth.secretKey : null,
    roleArn: input.auth.type == "assumeRole" ? input.auth.roleArn : null,
    externalId: input.auth.type == "assumeRole" ? input.auth.externalId : null,
    region: input.region,
    includedTags: input.tags?.include ?? "",
    excludedTags: input.tags?.exclude ?? "",
    services: input.services
      ? Object.fromEntries(
        input.services
          .map((service) => [service.type, toRawCreateAwsIntegrationInputService(service)]),
      )
      : {},
  };
}

function toRawCreateAwsIntegrationInputService(
  service: CreateAwsIntegrationInputService,
): RawCreateAwsIntegrationInputService {
  return {
    enable: true,
    retireAutomatically: isAutoRetirementSupportedType(service.type)
      ? (service as CreateAwsIntegrationInputAutoRetirementSupportedService).retireAutomatically
      : undefined,
    role: service.roleFullname ?? null,
    includedMetrics: !service.metrics
      ? undefined
      : service.metrics.type === "include"
      ? service.metrics.names
      : undefined,
    excludedMetrics: !service.metrics
      ? []
      : service.metrics.type === "exclude"
      ? service.metrics.names
      : undefined,
  };
}

function toRawUpdateAwsIntegrationInput(
  input: UpdateAwsIntegrationInput,
): RawCreateAwsIntegrationInput {
  return {
    name: input.name,
    memo: input.memo ?? "",
    key: !input.auth ? undefined : input.auth.type === "accessKey" ? input.auth.accessKey : null,
    secretKey: !input.auth
      ? undefined
      : input.auth.type === "accessKey"
      ? input.auth.secretKey
      : null,
    roleArn: !input.auth ? undefined : input.auth.type == "assumeRole" ? input.auth.roleArn : null,
    externalId: !input.auth
      ? undefined
      : input.auth.type == "assumeRole"
      ? input.auth.externalId
      : null,
    region: input.region,
    includedTags: input.tags?.include ?? "",
    excludedTags: input.tags?.exclude ?? "",
    services: input.services
      ? Object.fromEntries(
        input.services
          .map((service) => [service.type, toRawCreateAwsIntegrationInputService(service)]),
      )
      : {},
  };
}
