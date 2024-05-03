import { ApiClient } from "./api.ts";
import { ServiceClient } from "./services.ts";

export type MackerelClientOptions = {
  apiBase?: string | URL | undefined;
};

export class MackerelClient {
  readonly services: ServiceClient;

  constructor(apiKey: string, options: MackerelClientOptions) {
    const apiClient = new ApiClient(apiKey, {
      base: options.apiBase,
    });
    this.services = new ServiceClient(apiClient);
  }
}
