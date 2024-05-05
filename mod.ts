import type { Options } from "./types.ts";

import { ApiClient } from "./api.ts";

import { AlertsApiClient } from "./alerts.ts";
import { DowntimesApiClient } from "./downtimes.ts";
import { GraphAnnotationsApiClient } from "./graphAnnotations.ts";
import { GraphDefsApiClient } from "./graphDefs.ts";
import { HostsApiClient } from "./hosts.ts";
import { MetricsApiClient } from "./metrics.ts";
import { OrgApiClient } from "./org.ts";
import { ServicesApiClient } from "./services.ts";
import { UsersApiClient } from "./users.ts";

export type MackerelClientOptions = Options<{
  apiBase: string | URL;
}>;

export class MackerelClient {
  readonly alerts: AlertsApiClient;
  readonly downtimes: DowntimesApiClient;
  readonly graphAnnotations: GraphAnnotationsApiClient;
  readonly graphDefs: GraphDefsApiClient;
  readonly hosts: HostsApiClient;
  readonly metrics: MetricsApiClient;
  readonly org: OrgApiClient;
  readonly services: ServicesApiClient;
  readonly users: UsersApiClient;

  constructor(apiKey: string, options?: MackerelClientOptions) {
    const apiClient = new ApiClient(apiKey, {
      base: options?.apiBase,
    });
    this.alerts = new AlertsApiClient(apiClient);
    this.downtimes = new DowntimesApiClient(apiClient);
    this.graphAnnotations = new GraphAnnotationsApiClient(apiClient);
    this.graphDefs = new GraphDefsApiClient(apiClient);
    this.hosts = new HostsApiClient(apiClient);
    this.metrics = new MetricsApiClient(apiClient);
    this.org = new OrgApiClient(apiClient);
    this.services = new ServicesApiClient(apiClient);
    this.users = new UsersApiClient(apiClient);
  }
}
