# @evereactor/ucli

```shell
$ eve --help
━━━ Eve - 0.0.1 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  $ eve <command>

━━━ General commands ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  eve init [-c,--config #0] [-r,--replace]
    Initialize an eve configuration file

You can also print more details about any of these commands by calling them with
the `-h,--help` flag right after the command name.
```

## Commands

- [init](#init)

### init

```shell
$ eve init --help
Initialize an eve configuration file

━━━ Usage ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

$ eve init

━━━ Options ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  -c,--config #0    path to configuration file `[default:eve.yaml]`
  -r,--replace      overwrite an existing configuration file `[default:false]`

━━━ Details ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This command will create an `eve.yaml` configuration file from a series of
prompts.

━━━ Examples ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Create a new configuration file
  $ eve init

Replace an existing configuration file
  $ eve init --replace
```
