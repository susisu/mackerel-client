import { ApiClient } from "./api.ts";
import { HostsClient } from "./hosts.ts";
import { ServicesClient } from "./services.ts";

export type MackerelClientOptions = {
  apiBase?: string | URL | undefined;
};

export class MackerelClient {
  readonly hosts: HostsClient;
  readonly services: ServicesClient;

  constructor(apiKey: string, options: MackerelClientOptions) {
    const apiClient = new ApiClient(apiKey, {
      base: options.apiBase,
    });
    this.hosts = new HostsClient(apiClient);
    this.services = new ServicesClient(apiClient);
  }
}
