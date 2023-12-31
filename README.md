# Eve

Reactive event driven applications with bottomless storage

## Packages

| Name                                    |                                                  |
| --------------------------------------- | ------------------------------------------------ |
| [@evereactor/bloxy](./pkgs/bloxy)       | Object storage proxy and metadata cache          |
| [@evereactor/broker](./pkgs/broker)     | Broker for event streaming                       |
| [@evereactor/client](./pkgs/client)     | Typescript client SDK                            |
| [@evereactor/evectl](./pkgs/evectl)     | Eve command line tool                            |
| [@evereactor/kafka](./pkgs/kafka)       | Kafka API compatibility                          |
| [@evereactor/protocol](./pkgs/protocol) | Eve protocol library                             |
| [@evereactor/reactor](./pkgs/reactor)   | Reactive event loop for timers and events        |
| [@evereactor/storage](./pkgs/storage)   | Storage abstraction for event message structure  |
| [@evereactor/ucli](./pkgs/ucli)         | Universal CLI single binary                      |
| [@evereactor/webui](./pkgs/webui)       | Web management UI                                |

## Docker/OCI

Pre-built docker images are provided on [docker hub](https://hub.docker.com) as a
[universal image](https://hub.docker.com/r/evereactor/eve) and individual [components](https://github.com/rupurt/eve/tree/main/docker).

## Development

`eve` is a typescript monorepo targeting [bun](https://bun.sh) and recent versions of
[node](https://nodejs.org/en/about/previous-releases). This repository assumes you have [installed nix](https://determinate.systems/posts/determinate-nix-installer).

```shell
./scripts/bootstrap
```

Start a `nix` dev shell

```shell
nix develop -c $SHELL
```

Install dependencies from `npm`

```shell
npm install
```

Run dev mode for all packages

```shell
npm run dev
```

## Test

Run tests for all packages

```shell
npm run test
```

## Coverage

Generate a test coverage report for all packages

```shell
npm run coverage
```

## Build

`eve` compiles to a single binary on Linux, Mac & Windows

```shell
npm run build
```

## Release

`eve` can be packaged and compressed as gunzipped tarballs & zip files

```shell
npm run release
```

## License

`eve` is released under the [MIT license](./LICENSE)
