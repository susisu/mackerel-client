# mackerel-client

[![CI](https://github.com/susisu/mackerel-client/workflows/CI/badge.svg)](https://github.com/susisu/mackerel-client/actions?query=workflow%3ACI)

(unofficial) TypeScript client for the [Mackerel API](https://mackerel.io/api-docs/)

## Installation

Install from JSR.

``` console
# Deno
deno add @susisu/mackerel-client
# Node.js
npx jsr add @susisu/mackerel-client
```

## Usage

``` ts
import { MackerelClient } from "@susisu/mackerel-client";

const cli = new MackerelClient("<YOUR API KEY>");

// list hosts
const hosts = await cli.hosts.list();

// create a service
await cli.services.create({
  name: "myservice",
});

// etc.
```

## License

[MIT License](http://opensource.org/licenses/mit-license.php)

## Author

Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
