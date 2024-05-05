import { ApiClient } from "./api.ts";
import { HostsApiClient } from "./hosts.ts";
import { ServicesApiClient } from "./services.ts";

export type MackerelClientOptions = {
  apiBase?: string | URL | undefined;
};

export class MackerelClient {
  readonly hosts: HostsApiClient;
  readonly services: ServicesApiClient;

  constructor(apiKey: string, options?: MackerelClientOptions) {
    const apiClient = new ApiClient(apiKey, {
      base: options?.apiBase,
    });
    this.hosts = new HostsApiClient(apiClient);
    this.services = new ServicesApiClient(apiClient);
  }
}
