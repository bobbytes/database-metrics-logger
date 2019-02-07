<h1 align="center">Database Metrics Logger</h1>

<p align="center">
  <a href="https://david-dm.org/DaNautilus/database-metrics-logger">
    <img src="https://david-dm.org/DaNautilus/database-metrics-logger/status.svg?style=flat" alt="dependency" />
  </a>
  <a href="https://travis-ci.org/DaNautilus/database-metrics-logger">
    <img src="https://travis-ci.org/DaNautilus/database-metrics-logger.svg?branch=master" alt="travis" />
  </a>
  <a href="https://ci.appveyor.com/project/DaNautilus/database-metrics-logger/branch/master">
    <img src="https://ci.appveyor.com/api/projects/status/qdxspgrhf3an4sdl?svg=true&passingText=windows%20passing&pendingText=windows%20pending&failingText=windows%20failing" alt="appveyor" />
  </a>
  <a href="https://sonarcloud.io/dashboard?id=DaNautilus_database-metrics-logger">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=DaNautilus_database-metrics-logger&metric=coverage" alt="coverage" />
  </a>
  <a href="https://sonarcloud.io/dashboard/index/DaNautilus_database-metrics-logger">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=DaNautilus_database-metrics-logger&metric=alert_status" alt="quality gate" />
  </a>
</p>

<br />

![divider](./divider.png)

## ❯ Why

You want to log service metrics from your application on Cloud Foundry? - Yes? - Here you are 🙌 !!

![divider](./divider.png)

## ❯ Table of Contents

- [Supported Services](#-supported-services)
- [Quick Start](#-quick-start)
- [API](#-api)
- [Cloud Connectors](#-cloud-connectors)
- [Development](#-development)
- [Project Structure](#-project-structure)

![divider](./divider.png)

## ❯ Supported Services

| Service     | Version |
| ----------- | ------- |
| **MongoDB** | >=3.6.6 |
| **Redis**   | >=2.3.9 |

![divider](./divider.png)

## ❯ Quick Start

### Installation

Install library by using `npm`

```shell
npm install database-metrics-logger
```

or by using `yarn`

```shell
yarn add database-metrics-logger
```

### How to use

#### Step 1: Import DatabaseMetricsLogger

Using `CommonJS` module loader:

```javascript
const DatabaseMetricsLogger = require('database-metrics-logger');
```

Using `ES6` module loader:

```javascript
import { DatabaseMetricsLogger } from 'database-metrics-logger';
```

#### Step 2: Create new instance of CfServiceMetricsLogger

Create new instance of `DatabaseMetricsLogger` and provide [options](#-options):

```javascript
const credentials = [
  {
    databaseType: 'mongodb',
    host: 'your-mongodb-host',
    username: 'user',
    password: 'this-is-secret',
    port: 27017
    database: mongodbCredentials.database,
  },
  {
    databaseType: 'redis',
    host: 'your-redis-host',
    port: 6379,
    password: 'this-is-secret',
  }
];

const databaseMetricsLogger = new DatabaseMetricsLogger(credentials);
```

#### Step 3: Subscribe to receive service metrics and general logs

Subscribe `metrics` to receive service metrics data:

```javascript
databaseMetricsLogger.subscribe('metrics', data => {
  // do some fancy stuff with your metrics
});
```

Subscribe `logs` to receive general application logs:

```javascript
databaseMetricsLogger.subscribe('logs', {message, level} => {
  console[level](message));
});
```

#### Step 3: Start and stop service metrics logging

Start database metrics logging:

```javascript
databaseMetricsLogger.start();
```

Stop service metrics logging:

```javascript
databaseMetricsLogger.stop();
```

![divider](./divider.png)

## ❯ API

### Credentials Options

| Option                | Description                                                      | Default Value |
| --------------------- | ---------------------------------------------------------------- | ------------: |
| `databaseType`        | Type of database. Currently only `mongodb` `redis` are available |               |
| `host`                | Host of database                                                 |               |
| `port` (optional)     | Port of database                                                 |               |
| `uri` (optional)      | Instead of port and host, you can provide an URI                 |               |
| `username` (optional) | Username                                                         |               |
| `password` (optional) | Password                                                         |               |
| `interval` (optional) | Database metrics polling interval in ms                          | `10000`       | 

### Methods

| Method                           | Description            |
| -------------------------------- | ---------------------- |
| `start()`                        | Start service metrics  |
| `stop()`                         | Stop service metrics   |
| `subscribe(eventId, callback)`   | Subscribe an event     |
| `unsubscribe(eventId, callback)` | Unsubscribe an event   |
| `unsubscribeAll()`               | Unsubscribe all events |

### Subscription event id's

| Id        | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| `metrics` | Service metrics                                                        |
| `logs`    | General application logs for levels `debug`, `info`, `warn` and `error` |

![divider](./divider.png)

## ❯ Cloud Connectors

You can use a cloud connector to log metrics from your cloud instance databases.

### Cloud Foundry

#### Options

| Option                                    | Description                                                    | Default Value |
| ----------------------------------------- | -------------------------------------------------------------- | ------------: |
| `vcap` (optional)                         | Provide local `VCAP_SERVICES` and/or `VCAP_APPLICATION` values | `{}`          |
| `vcapFile` (optional)                     | Provide local `VCAP_SERVICES` and/or `VCAP_APPLICATION` file   | `''`          |

#### Methods

| Method             | Description                           |
| ------------------ | ------------------------------------- |
| `getCredentials()` | Get Cloud Foundry service credentials |

#### Example

```javascript
// import using `CommonJS` module loader:
const { CloudFoundryConnector, DatabaseMetricsLogger } = require('cf-service-metrics-logger');

// or import using `ES6` module loader:
import { CloudFoundryConnector, DatabaseMetricsLogger } from 'cf-service-metrics-logger';

const options = {
  vcapFile: 'your-vcap-file-path/vcap.json' 
};

const cloudFoundryConnector = new CloudFoundryConnector(options);
const credentials = cloudFoundryConnector.getCredentials();
const databaseMetricsLogger = new DatabaseMetricsLogger(credentials);

databaseMetricsLogger.subscribe('metrics', data => {
  // do some fancy stuff with your metrics
});

databaseMetricsLogger.start();

setTimeout(() => {
  databaseMetricsLogger.stop();
}, 30000);
```

![divider](./divider.png)

## ❯ Development

### Getting Started

#### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

Install yarn globally

```bash
yarn install yarn -g
```

#### Step 2: Install dependencies

Install all dependencies with yarn.

```bash
yarn install
```

### Scripts and Tasks

#### Install

- Install all dependencies with `yarn install`

#### Linting

- Run code quality analysis using `yarn run lint`. This runs tslint.

#### Tests

- Run unit test using `yarn run test`.

#### Building the project

- Run `yarn run build` to generate commonJS and ES6 modules as well as declaration from the TypeScript source.
- Builded sources are located in `dist` folder.

### Debugger

#### VS Code

Just set a breakpoint in source or unit test and hit <kbd>F5</kbd> in your Visual Studio Code to execute and debug all unit tests.

![divider](./divider.png)

## ❯ Project Structure

| Name                              | Description |
| --------------------------------- | ----------- |
| **.vscode/**                      | VSCode tasks, launch configuration and some other settings |
| **dist/**                         | Compiled and bundled source files will be placed here |
| **src/**                          | Source files |
| **src/types/** *.d.ts             | Custom type definitions and files that aren't on DefinitelyTyped |
| **test/**                         | Tests |
| **test/unit/** *.test.ts          | Unit tests |
| rollup.config.js                  | Config for Rollup module bundler |
