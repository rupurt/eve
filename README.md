# Eve

Reactive event driven applications with bottomless storage

## Packages

| Name                                                |                                                   |
| --------------------------------------------------- | ------------------------------------------------- |
| [@evereactor/reactor](./pkgs/reactor)               | Reactive event loop for timers and events         |

## Docker/OCI

Pre-built docker images are provided on [docker hub](https://hub.docker.com) as a
[universal image](https://hub.docker.com/r/evereactor/eve) and individual [components](https://github.com/rupurt/eve/tree/main/docker).

## Development

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
