# Mandaten-besluit-consumer-app

An application that will consume all triples that are being harvested by the "besluiten" harvesters. A configuration is in place to process a set of [_interesting types_](config/ldes-delta-pusher/ldes-instances.ts), these triples will than be set on the `/public` LDES stream.

## Environment variables

As we are using services that need a specific configuration, we suggest you read the instructions of the specific services when something is unclear.

Below we will add the most important environment variables so you are up to date with adjustments you can make.

### Delta-consumers

- **DCR_CRON_PATTERN_DELTA_SYNC**: `0 * * * *` Every hour new triples will be consumed from the harvester.
- **DCR_START_FROM_DELTA_TIMESTAMP**: `2024-10-01` The date from where we want to start digesting the delta's.

### Ldes-backend

- **BASE_URL**: `https://mandaten-besluiten.lblod.info/streams/ldes/` The LDES stream where the interesting types will be added to.

### Ldes-delta-pusher

- **LDES_BASE**: `https://mandaten-besluiten.lblod.info/streams/ldes` The LDES stream where the interesting types will be added to.
- **WRITE_INITIAL_STATE**: `false` We want to harvested the "besluiten" starting from a specific date.
- **CRON_PATTERN_CLEANUP**: `0 */2 * * *` Every 2 hours a cleanup is done of the consumed triples (from the harvester) graph. This is done as we will put all triples in our store, even the non-interesting types.

## Endpoints

### Harvester url's

- Development
  - https://dev.harvesting-self-service.lblod.info (harvester url)
  - https://dev.harvesting-self-service.lblod.info/login (login to manage the harvesting jobs, create/monitor)
- Testing/production
  - https://lokaalbeslist-harvester-0.s.redhost.be/
  - https://lokaalbeslist-harvester-1.s.redhost.be/
  - https://lokaalbeslist-harvester-2.s.redhost.be/
  - https://lokaalbeslist-harvester-3.s.redhost.be/

## Used services

- [All base mu.semte.ch services to setup an application](https://semantic.works/docs)
- [Delta-consumer](https://github.com/lblod/delta-consumer?tab=readme-ov-file#delta-consumer)
- [Fragmentation producer](https://github.com/redpencilio/fragmentation-producer-service?tab=readme-ov-file#implementation-of-an-tree-fragmentation-service)
- [Ldes-delta-pusher](https://github.com/redpencilio/ldes-delta-pusher-service?tab=readme-ov-file#ldes-publisher-service)

## Consuming the ldes stream for _besluiten_

You can make use of the [LDES-client](https://github.com/lblod/ldes-client?tab=readme-ov-file#ldes-client) service to start using the published ldes-stream.

To get started this you can add this service to the application where you need the ldes-stream data that is published on the ldes-stream used in this app.

```yml
ldes-client:
  image: lblod/ldes-client:0.0.3
  links:
    - database:database
    - virtuoso:virtuoso
  restart: always
  environment:
    LDES_BASE: https://mandaten-besluiten.lblod.info/streams/ldes/public/
    FIRST_PAGE: https://mandaten-besluiten.lblod.info/streams/ldes/public/1
    TARGET_GRAPH: http://mu.semte.ch/graphs/besluiten-consumed
    WORKING_GRAPH: http://mu.semte.ch/graphs/besluiten-consumed-tmp
    DIRECT_DATABASE_CONNECTION: "http://virtuoso:8890/sparql"
    RANDOMIZE_GRAPHS: true
    BATCH_SIZE: 100
    BYPASS_MU_AUTH: false
  labels:
    - "logging=true"
  logging: *default-logging
```
