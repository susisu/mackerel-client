import { ApiClient } from "./api.ts";
import { ServicesClient } from "./services.ts";

export type MackerelClientOptions = {
  apiBase?: string | URL | undefined;
};

export class MackerelClient {
  readonly services: ServicesClient;

  constructor(apiKey: string, options: MackerelClientOptions) {
    const apiClient = new ApiClient(apiKey, {
      base: options.apiBase,
    });
    this.services = new ServicesClient(apiClient);
  }
}
