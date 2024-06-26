import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";
import type { ApiOptions, Fetcher } from "./fetcher.ts";

assertType<Extends<GraphAnnotation, CreateGraphAnnotationInput>>(true);

export type GraphAnnotation = {
  id: string;
  title: string;
  description: string;
  from: Date;
  to: Date;
  serviceName: string;
  roleNames: string[];
};

export type CreateGraphAnnotationInput = Readonly<{
  title: string;
  description?: string | undefined;
  from: Date;
  to: Date;
  serviceName: string;
  roleNames?: readonly string[] | undefined;
}>;

export class GraphAnnotationsApiClient {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  async list(
    serviceName: string,
    range: Readonly<{
      from: Date;
      to: Date;
    }>,
    options?: ApiOptions,
  ): Promise<GraphAnnotation[]> {
    const params = new URLSearchParams({
      service: serviceName,
      from: Math.floor(range.from.getTime() / 1000).toString(),
      to: Math.floor(range.to.getTime() / 1000).toString(),
    });
    const res = await this.fetcher.fetch<{ graphAnnotations: RawGraphAnnotation[] }>(
      "GET",
      "/api/v0/graph-annotations",
      {
        params,
        signal: options?.signal,
      },
    );
    return res.graphAnnotations.map((annotation) => fromRawGraphAnnotation(annotation));
  }

  async create(
    input: CreateGraphAnnotationInput,
    options?: ApiOptions,
  ): Promise<GraphAnnotation> {
    const res = await this.fetcher.fetch<RawGraphAnnotation, RawCreateGraphAnnnotationInput>(
      "POST",
      "/api/v0/graph-annotations",
      {
        body: toRawCreateGraphAnnnotationInput(input),
        signal: options?.signal,
      },
    );
    return fromRawGraphAnnotation(res);
  }

  async update(
    annotationId: string,
    input: CreateGraphAnnotationInput,
    options?: ApiOptions,
  ): Promise<GraphAnnotation> {
    const res = await this.fetcher.fetch<RawGraphAnnotation, RawCreateGraphAnnnotationInput>(
      "PUT",
      `/api/v0/graph-annotations/${annotationId}`,
      {
        body: toRawCreateGraphAnnnotationInput(input),
        signal: options?.signal,
      },
    );
    return fromRawGraphAnnotation(res);
  }

  async delete(
    annotationId: string,
    options?: ApiOptions,
  ): Promise<GraphAnnotation> {
    const res = await this.fetcher.fetch<RawGraphAnnotation>(
      "DELETE",
      `/api/v0/graph-annotations/${annotationId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawGraphAnnotation(res);
  }
}

type RawGraphAnnotation = {
  id: string;
  title: string;
  description: string;
  from: number;
  to: number;
  service: string;
  roles?: string[] | null | undefined;
};

function fromRawGraphAnnotation(raw: RawGraphAnnotation): GraphAnnotation {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    from: new Date(raw.from * 1000),
    to: new Date(raw.to * 1000),
    serviceName: raw.service,
    roleNames: raw.roles ?? [],
  };
}

type RawCreateGraphAnnnotationInput = Readonly<{
  title: string;
  description?: string | undefined;
  from: number;
  to: number;
  service: string;
  roles?: readonly string[] | undefined;
}>;

function toRawCreateGraphAnnnotationInput(
  input: CreateGraphAnnotationInput,
): RawCreateGraphAnnnotationInput {
  return {
    title: input.title,
    description: input.description,
    from: Math.floor(input.from.getTime() / 1000),
    to: Math.floor(input.to.getTime() / 1000),
    service: input.serviceName,
    roles: input.roleNames,
  };
}
