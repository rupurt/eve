# Commands @evereactor/broker

```shell
$ broker --help
━━━ Eve broker - 0.0.1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  $ broker <command>

━━━ General commands ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  broker config [-c,--config #0]
    display broker configuration

  broker init [-c,--config #0] [-r,--replace]
    initialize a brokers configuration file

  broker start [-c,--config #0] [-h,--host #0] [-p,--port]
    start a broker with a http listener

  broker stop [-h,--host #0] [-p,--port]
    stop a running broker via it's http listener

You can also print more details about any of these commands by calling them with
the `-h,--help` flag right after the command name.
```

## Commands

- [config](#config)
- [init](#init)
- [start](#start)
- [stop](#stop)

### config

```shell
$ broker config --help
...
```

### init

```shell
$ broker init --help
...
```

### start

```shell
Start a broker with a http listener

━━━ Usage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ broker start

━━━ Options ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  -c,--config #0       path to configuration file `[default:eve.broker.yaml]`
  -h,--host #0         host to listen on `[default:[::]]`
  -p,--port #0         port to listen on `[default:8080]`
  -l,--log-level #0    log level `[default:info]`

━━━ Details ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This command will start an eve broker with a http listener to manage topics of
streaming records over object storage.

━━━ Examples ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start an eve broker from the default configuration file
  $ broker start

Start an eve broker from a custom configuration file
  $ broker start --config eve.superbroker.yaml
```

### stop

```shell
$ broker stop --help
Stop a running broker via it's http listener

━━━ Usage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ broker stop

━━━ Options ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  -h,--host #0    host broker is listening on `[default:[::]]`
  -p,--port       port broker is listening on `[default:8080]`

━━━ Details ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This command will remove the specified packages from the current workspace. If
the `-A,--all` option is set, the operation will be applied to all workspaces
from the current project.

━━━ Examples ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Remove a dependency from the current project
  $ broker remove lodash

Remove a dependency from all workspaces at once
  $ broker remove lodash --all
```
