<h1 align="center">Cloud Foundry Service Metrics Logger</h1>

<p align="center">
  <a href="https://david-dm.org/DaNautilus/cf-service-metrics-logger">
    <img src="https://david-dm.org/DaNautilus/cf-service-metrics-logger/status.svg?style=flat" alt="dependency" />
  </a>
  <a href="https://travis-ci.org/DaNautilus/cf-service-metrics-logger">
    <img src="https://travis-ci.org/DaNautilus/cf-service-metrics-logger.svg?branch=master" alt="travis" />
  </a>
  <a href="https://ci.appveyor.com/project/DaNautilus/cf-service-metrics-logger/branch/master">
    <img src="https://ci.appveyor.com/api/projects/status/hln22i8cy56xe65o?svg=true&passingText=windows%20passing&pendingText=windows%20pending&failingText=windows%20failing" alt="appveyor" />
  </a>
  <a href="https://sonarcloud.io/dashboard?id=DaNautilus_cf-service-metrics-logger">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=DaNautilus_cf-service-metrics-logger&metric=coverage" alt="coverage" />
  </a>
  <a href="https://sonarcloud.io/dashboard/index/DaNautilus_cf-service-metrics-logger">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=DaNautilus_cf-service-metrics-logger&metric=alert_status" alt="quality gate" />
  </a>
</p>

<br />

![divider](./divider.png)

## ❯ Table of Contents

- [Quick Start](#-quick-start)
- [Development](#-development)
- [Project Structure](#-project-structure)

![divider](./divider.png)

## ❯ Quick Start

### Installation

Install library by using `npm`

```shell
npm install cf-service-metrics-logger
```

or by using `yarn`

```shell
yarn add cf-service-metrics-logger
```

### How to use

Create a new instance of CfServiceMetricsLogger and pass any kind of logger implementing following interface:

- debug(message: `{} | [] | string | number`)
- info(message: `{} | [] | string | number`)
- warn(message: `{} | [] | string | number`)
- error(message: `{} | [] | string | number`)

```javascript
/* import library by using CommonJS module loader */
const CfServiceMetricsLogger = require('cf-service-metrics-logger');

/* or import library by using ES6 module loader */
import { CfServiceMetricsLogger } from 'cf-service-metrics-logger';

/* create logger instance or use a logger library */
class Logger {
  debug(message) {
    console.debug(message);
  }

  info(message) {
    console.info(message);
  }

  warn(message) {
    console.warn(message);
  }

  error(message) {
    console.error(message);
  }
}

const logger = new Logger();

/* you can add some options to CfServiceMetricsLogger */
const options = {
  mongoDB: {
    serverStatusInterval: 10000, //optional
    bStatsInterval: 20000, //optional
  },
  redis: {
    infoInterval: 100000 //optional
  },
  vcap: {}; //optional
  vcapFile: ''; //optional
};

/* create new instance of CfServiceMetricsLogger and pass logger instance and optional options */
const cfServiceMetricsLogger = new CfServiceMetricsLogger(logger, options);

/* start service metrics logging */
cfServiceMetricsLogger.start();

/* stop service metrics logging */
cfServiceMetricsLogger.stop();
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

#### Step 2: Set up Environment Variables

Copy the `vcap.example.json` file and rename it to `vcap.json`. This file provides `VCAP_SERVICES` and/or `VCAP_APPLICATION` for local development.
More information is provided [here](https://github.com/cloudfoundry-community/node-cfenv#running-in-cloud-foundry-vs-locally).

#### Step 3: Install dependencies

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
| vcap.example.json                 | Provides `VCAP_SERVICES` and/or `VCAP_APPLICATION` for local development |
| vcap.test.json                    | Provides `VCAP_SERVICES` and/or `VCAP_APPLICATION` for unit tests |
| rollup.config.js                  | Config for Rollup module bundler |
