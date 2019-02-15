# Smoke-Pack

A npm project provisioning and build system for browser, electron, node and library projects.

```
npm install smoke-pack -g
```
```
smoke-pack add app electron
smoke-pack add lib library
smoke-pack link app lib
smoke-pack watch app
```

## Overview

Smoke-Pack is a project provisioning and build system tool for npm packages and applications. It provides a set of core templates for provisioning `browser`, `electron`, `node` and `library` projects with each setup ready for npm publishing. Additionally, this tool provides build infrastructure for cross linking, building and watching projects managed within a single workspace. 

This tool was primarily written to allow for locally developed libraries to be seemlessly linked and shared across `browser`, `electron` and `node` applications.

All project templates are written in TypeScript and all support direct linking via `npm link`, each project is configured to support incremental build workflows with TypeScript's `--watch` option.

## Options

```

$ smoke-pack <command> <...args>

Options: smoke-pack create <name> <type>
         smoke-pack add    <name> <type>
         smoke-pack remove <name>
         smoke-pack link   <name> <dependency>
         smoke-pack unlink <name> <dependency>
         smoke-pack clean  <name>
         smoke-pack build  <name>
         smoke-pack watch  [...<names>]
         smoke-pack start  <name>
         smoke-pack test   <name>
         smoke-pack pack   <name>
         smoke-pack run    <name> <script>
         smoke-pack list

```

## Project Types

Smoke-Pack provides project templates for the following project types.

Command                             | Description
---                                 | --- 
`smoke-pack create my-lib library`  | linkable npm package library.           |
`smoke-pack create my-app console`  | node console application.               |
`smoke-pack create my-app browser`  | browser application w/ webpack          |
`smoke-pack create my-app electron` | electron application                    |
`smoke-pack create my-app empty`    | pure node + javascript console project. |


## Project Commands

The Smoke-Pack cli provides a number of command line options for linking and building projects. Each command will call into a projects `tasks.js` file and run one of its `clean`, `build`, `watch`, `start`, `test` and `pack` operations to carry out various build tasks. Custom projects can be added by implementing the `task interface` below.

Command                                  | Description
---                                      | --- 
`smoke-pack create <name> <type>`        | creates a standalone project in the current working directory.   |
`smoke-pack add <name> <type>`           | creates a new project in the `./packages/<name>` directory.      |
`smoke-pack remove <name>`               | removes a project from the `./packages/<name>` directory.        |
`smoke-pack link <name> <dependency>`    | links the `<dependency>` to the given project `<name>`           |
`smoke-pack unlink <name> <dependency>`  | unlinks the `<dependency>` from the given project `<name>`       |
`smoke-pack clean <name>`                | cleans the project, deleting `node_modules` and build artifacts. |
`smoke-pack build <name>`                | builds a project in `./packages/<name>/public/bin`.              |
`smoke-pack watch <name>`                | builds and watches a project in `./packages/<name>/public/bin`.  |
`smoke-pack start <name>`                | builds and starts a project in `./packages/<name>/public/bin`.   |
`smoke-pack test <name>`                 | tests the project on `./packages/<name>/public/test`.            |
`smoke-pack pack <name>`                 | builds a redistributable in `./packages/<name>/public/pack`.     |
`smoke-pack run <name> <script>`         | runs custom npm scripts in `./packages/<name>/package.json`.     |
`smoke-pack list`                        | lists projects and dependencies managed by this tool.            |

## Task Interface

Smoke-Pack mandates that all projects implement a common set of tasks which are run via `npx` or `npm script`. The tasks provided by this project are written with the `smoke-task` npm package which runs a `tasks.js` file located in the project root. The following outlines the high level role of each task.

Task                                     | Description
---                                      | --- 
`clean`                                  | Should clean out all build artifacts incl install dependencies.   |
`build`                                  | Should build the entirety of the project and write artifacts to `public/bin` |
`build_conditional`                      | Should `build` as above but only if not already built.           |
`start`                                  | Should `build_conditional` then run the project.          |
`watch`                                  | Should `build_conditional` then watch / incremental and `start`.      |
`test`                                   | Should `build` and test the project with artifacts written to `public/test` |
`pack`                                   | Should `build` and produce redistributable in `public/pack`              |
For example implementations of the above interface, run `smoke-pack create` for one of the project templates provided with this project.


## Project Tasks

This project provides the following build tasks.

```bash
npm run clean       # cleans this project
npm run build       # builds this project
npm run pack        # builds via npm pack.
npm run install_cli # install smoke-pack locally.
npm run watch       # watches / install smoke-pack on save.
```
