import type { Options } from "./types.ts";

import { DefaultFetcher } from "./fetcher.ts";

import { AlertGroupSettingsApiClient } from "./alertGroupSettings.ts";
import { AlertsApiClient } from "./alerts.ts";
import { AwsIntegrationsApiClient } from "./awsIntegrations.ts";
import { ChannelsApiClient } from "./channels.ts";
import { DashboardsApiClient } from "./dashboards.ts";
import { DowntimesApiClient } from "./downtimes.ts";
import { GraphAnnotationsApiClient } from "./graphAnnotations.ts";
import { GraphDefsApiClient } from "./graphDefs.ts";
import { HostsApiClient } from "./hosts.ts";
import { MetricsApiClient } from "./metrics.ts";
import { MonitorsApiClient } from "./monitors.ts";
import { OrgApiClient } from "./org.ts";
import { ServicesApiClient } from "./services.ts";
import { UsersApiClient } from "./users.ts";

export type MackerelClientOptions = Options<{
  apiBase: string | URL;
}>;

export class MackerelClient {
  readonly alertGroupSettings: AlertGroupSettingsApiClient;
  readonly alerts: AlertsApiClient;
  readonly awsIntegrations: AwsIntegrationsApiClient;
  readonly channels: ChannelsApiClient;
  readonly dashboards: DashboardsApiClient;
  readonly downtimes: DowntimesApiClient;
  readonly graphAnnotations: GraphAnnotationsApiClient;
  readonly graphDefs: GraphDefsApiClient;
  readonly hosts: HostsApiClient;
  readonly metrics: MetricsApiClient;
  readonly monitors: MonitorsApiClient;
  readonly org: OrgApiClient;
  readonly services: ServicesApiClient;
  readonly users: UsersApiClient;

  constructor(apiKey: string, options?: MackerelClientOptions) {
    const fetcher = new DefaultFetcher(apiKey, {
      base: options?.apiBase,
    });
    this.alertGroupSettings = new AlertGroupSettingsApiClient(fetcher);
    this.alerts = new AlertsApiClient(fetcher);
    this.awsIntegrations = new AwsIntegrationsApiClient(fetcher);
    this.channels = new ChannelsApiClient(fetcher);
    this.dashboards = new DashboardsApiClient(fetcher);
    this.downtimes = new DowntimesApiClient(fetcher);
    this.graphAnnotations = new GraphAnnotationsApiClient(fetcher);
    this.graphDefs = new GraphDefsApiClient(fetcher);
    this.hosts = new HostsApiClient(fetcher);
    this.metrics = new MetricsApiClient(fetcher);
    this.monitors = new MonitorsApiClient(fetcher);
    this.org = new OrgApiClient(fetcher);
    this.services = new ServicesApiClient(fetcher);
    this.users = new UsersApiClient(fetcher);
  }
}
