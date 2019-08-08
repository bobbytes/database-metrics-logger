# Changelog

## [0.8.2] - 2019-08-08

### General

- Remove OSX from travis ci due to build performance issues.

### Fixed

- Fix lodash and handlebars security issue.

## [0.8.1] - 2019-08-07

### General

- Dependencies updated.

### Fixed

- Get MongoDB storage size in bytes

## [0.8.0] - 2019-07-05

### General

- Add MongoDB oplog metrics.
- Upgrade rollup dependency.

## [0.7.1] - 2019-07-01

### General

- Add name of MongoDB replication set member to metrics.
- Upgrade rollup dependency.

## [0.7.0] - 2019-06-28

### General

- Dependencies updated.

### Added

- Get replication lags from all MongoDB replication set members.


## [0.6.9] - 2019-06-06

### General

- Upgrade jest dependencies.
- Upgrade rollup dependencies.
- Upgrade typescript to version 3.5.1.

## [0.6.8] - 2019-05-27

### General

- Dependencies updated.

## [0.6.7] - 2019-05-27

### Fixed

-  Default host for datadog metrics.

## [0.6.6] - 2019-05-17

### Added

- Push MongoDB and Redis metrics as logs instead of metrics to Datadog.
- Add OSX to travis build system.

## [0.6.5] - 2019-05-15

### Added

- Add version metrics for MongoDB and Redis.
- Add version tag to each MongoDB and Redis metric.

## [0.6.4] - 2019-04-29

### Added

- Add tags to Datadog transport options

## [0.6.3] - 2019-04-26

### Added

- Add additional MongoDB metrics for storage size and replication set members

## [0.6.2] - 2019-04-24

### Added

- Add Greenkeeper as a dependency update helper.

### Fixed

- Datadog options interface import.

## [0.6.1] - 2019-04-24

### Added

- MongoDb Replication set name added as tag to Datadog transport

### General

- General refactoring.

## [0.6.0] - 2019-04-24

### Added

- MongoDb metrics for replication sets.
- MongoDb operation logs per second.

### General

- Dependency updates.
- General refactoring.

## [0.5.5] - 2019-04-12

### Added

- Add redis info master link down to metrics

### General

- Small refactoring

## [0.5.4] - 2019-04-11

### Added

- Add redis info latency to metrics.
- Add redis slow log execution time percentile (95) to metrics.

## [0.5.3] - 2019-04-11

### Added

- Add redis changes since last save metric to Datadog transport.
- Add redis database size to metrics.

## [0.5.2] - 2019-04-10

### General

- Upgrade mongodb, mongodb-memory-server, rollup, ts-jest, typescript dependencies.

## [0.5.1] - 2019-04-10

### General

- Code refactoring.
- Database type added as a tag to Datadog transport.

## [0.5.0] - 2019-04-05

### Added

- Datadog support.

## [0.4.8] - 2019-04-01

### General

- Upgrade ts-jest and typescript dependencies.

## [0.4.7] - 2019-03-28

### General

- Upgrade @types/redis, mongodb, mongodb-memory-server, tslint, cfenv, jest and rollup dependencies.

## [0.4.6] - 2019-03-12

### Added

- Calculate free memory and storage size for MongoDB and add it to logs.
- Calculate used percentage of memory and storage for MongoDB and add it to logs.

## [0.4.5] - 2019-03-11

### Fixed

- Add missing MongoDB memory status to logs.

## [0.4.4] - 2019-03-08

### General

- Jest dependencies updated.

## [0.4.3] - 2019-03-08

### Fixed

- Add missing MongoDB replication set status to logs.

## [0.4.2] - 2019-02-19

### General

- Convert Redis metrics values to numbers.

## [0.4.1] - 2019-02-19

### General

- Different MongoDB metrics are merged into a single response.
- MongoDB metrics response is reduced to most relevant metrics due to size limitations of some log services.

### Added

- MongoDB replication set metrics added.

### Fixed

- MongoDB polling issue.

## [0.3.1] - 2019-02-15

### Added

- Database type is added to the returned metrics.
- A name to identify the returned database metrics added.
- CloudFoundry connector adds database name to credentials.

## [0.3.0] - 2019-02-07

### General

- Make this library more general by separate cloud foundry functionality to a separate connector.

## [0.2.1] - 2019-02-04

### Fixed

- Skip mongodb unit test for now.

## [0.2.0] - 2019-02-04

### General

- Implement pub sub pattern to receive metrics as well as application logs.

### Fixed

- Proper mongodb error handling.

## [0.1.5] - 2019-01-31

### Added

- Update Readme.
- Update of jest.

## [0.1.4] - 2019-01-31

### Added

- Replace coveralls with sonarqube quality gate.

## [0.1.3] - 2019-01-31

### Added

- Sonarqube quality gate.

## [0.1.2] - 2019-01-30

### Added

- Replace coveralls with codecov.

## [0.1.0] - 2019-01-29

### Added

- Cloud Foundry Service Metrics Logger.
- MongoDB support.
- Redis support.
