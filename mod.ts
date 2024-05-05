import type { Options } from "./types.ts";

import { ApiClient } from "./api.ts";

import { GraphDefsApiClient } from "./graphDefs.ts";
import { HostsApiClient } from "./hosts.ts";
import { MetricsApiClient } from "./metrics.ts";
import { ServicesApiClient } from "./services.ts";

export type MackerelClientOptions = Options<{
  apiBase: string | URL;
}>;

export class MackerelClient {
  readonly graphDefs: GraphDefsApiClient;
  readonly hosts: HostsApiClient;
  readonly metrics: MetricsApiClient;
  readonly services: ServicesApiClient;

  constructor(apiKey: string, options?: MackerelClientOptions) {
    const apiClient = new ApiClient(apiKey, {
      base: options?.apiBase,
    });
    this.graphDefs = new GraphDefsApiClient(apiClient);
    this.hosts = new HostsApiClient(apiClient);
    this.metrics = new MetricsApiClient(apiClient);
    this.services = new ServicesApiClient(apiClient);
  }
}
