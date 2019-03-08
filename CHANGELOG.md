# Changelog

## [0.4.4] - 2019-03-08

### General

- Jest dependencies updated

## [0.4.3] - 2019-03-08

### Fixed

- Add missing MongoDB replication set status to logs

## [0.4.2] - 2019-02-19

### General

- Convert Redis metrics values to numbers

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

- Make this library more general by separate cloud foundry functionality to a separate connector

## [0.2.1] - 2019-02-04

### Fixed

- Skip mongodb unit test for now

## [0.2.0] - 2019-02-04

### General

- Implement pub sub pattern to receive metrics as well as application logs.

### Fixed

- Proper mongodb error handling.

## [0.1.5] - 2019-01-31

### Added

- Update Readme
- Update of jest

## [0.1.4] - 2019-01-31

### Added

- Replace coveralls with sonarqube quality gate

## [0.1.3] - 2019-01-31

### Added

- Sonarqube quality gate

## [0.1.2] - 2019-01-30

### Added

- Replace coveralls with codecov

## [0.1.0] - 2019-01-29

### Added

- Cloud Foundry Service Metrics Logger
- MongoDB support
- Redis support
