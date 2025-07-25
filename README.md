# mackerel-client

[![JSR](https://jsr.io/badges/@susisu/mackerel-client)](https://jsr.io/@susisu/mackerel-client)
[![CI](https://github.com/susisu/mackerel-client/actions/workflows/ci.yml/badge.svg)](https://github.com/susisu/mackerel-client/actions/workflows/ci.yml)

(unofficial) TypeScript client for the [Mackerel API](https://mackerel.io/api-docs/)

## Installation

Install from JSR.

```console
# Deno
deno add @susisu/mackerel-client
# Node.js
npx jsr add @susisu/mackerel-client
```

## Usage

```ts
import { MackerelClient } from "@susisu/mackerel-client";

const client = new MackerelClient("<YOUR API KEY>");

// list hosts
const hosts = await client.hosts.list();

// create a service
await client.services.create({
  name: "myservice",
});

// etc.
```

## License

[MIT License](http://opensource.org/licenses/mit-license.php)

## Author

Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
