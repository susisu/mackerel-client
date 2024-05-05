import type { Options } from "./types.ts";
import { ApiClient } from "./api.ts";
import { HostsApiClient } from "./hosts.ts";
import { ServicesApiClient } from "./services.ts";
import { MetricsApiClient } from "./metrics.ts";

export type MackerelClientOptions = Options<{
  apiBase: string | URL;
}>;

export class MackerelClient {
  readonly hosts: HostsApiClient;
  readonly services: ServicesApiClient;
  readonly metrics: MetricsApiClient;

  constructor(apiKey: string, options?: MackerelClientOptions) {
    const apiClient = new ApiClient(apiKey, {
      base: options?.apiBase,
    });
    this.hosts = new HostsApiClient(apiClient);
    this.services = new ServicesApiClient(apiClient);
    this.metrics = new MetricsApiClient(apiClient);
  }
}
