# Mandaten-besluit-consumer-app

## Application

Monitoring the endpoints where the "besluiten" are harvested. This is done by using the [delta-consumer-services](https://github.com/lblod/delta-consumer/blob/master/README.md). When running this app it will do an inital sync of all the harvested data from the endpoints. The data that is added to the virtuoso can be filtered out by defining interesting types in the configuration.

## Flow

When starting the app and you have enabled the inital sync it will create a job so all the triples that where added in the past can be added through a _dispatch()_. In this dispatch all triples are written to the _staging graph_. This can be set through the environment variable **DCR_LANDING_ZONE_GRAPH**.

Next to the _inital sync dispatch_ we have a _delta sync dispatch_ this will get a changeset of triples. These triples are also added to the _staging graph_ first before it is added to the _target graph_.

Everytime a _dispatch()_ is done an extra triple is added. A modified reference triple is added to the subject to keep track of the changes. This will be used to cleanup the _staging graph_.

Now that all the data is in our _staging graph_ we can filter out the triples that are interesting for us. A environment variable **INTERESTING_TYPES** can be set to specify the these types. We have set a default type so when it is not overwritten it will always get the _http://data.vlaanderen.be/ns/besluit#Besluit_. All these interesting types are added to a _target graph_ this graph can be overwritten by setting **TARGET_GRAPH**.

To get all the inserted data you can query accordingly on the endpoint set by **DATABASE_ENDPOINT** in the environment variables.

## Environment variables

- **DCR_SYNC_BASE_URL**: The endpoint where the besluiten harvaster can reached
- **DCR_LANDING_ZONE_GRAPH**: The _staging graph_ that is used to add all the data that comes in through the _inital sync_ or the _delta sync_
- **INTERESTING_TYPES**: All uri's that we want to insert into the _target graph_
- **TARGET_GRAPH**: The final graph where all the _interesting types_ will be added to
- **TARGET_DATABASE_ENDPOINT**: The database connection that can be called for adding the triples

## Endpoints

These values can be added as the **DCR_SYNC_BASE_URL**.

### QA

- https://lokaalbeslist-harvester-0.s.redhost.be/
- https://lokaalbeslist-harvester-1.s.redhost.be/
- https://lokaalbeslist-harvester-2.s.redhost.be/
- https://lokaalbeslist-harvester-3.s.redhost.be/

## Setting up the delta-producer: mandatees-decisions

### High level description
Delta production consists of four stages.

The first stage is an initial sync of the publication graph. This stage takes the necessary data from the source graph and populates the publication graph. Afterward, it creates a dump file (as a `dcat:Dataset`) to make it available for consumers. The reasons for this stage are:
- Usually, there is already relevant data available in the database for consumers.
- Packaging it as a dump file speeds up the first sync for consumers compared to using small delta files.

The second stage, after the initial sync, is the 'normal operation mode'. In this stage, internal deltas come in, and the publication graph maintainer decides whether the data needs to be published to the outside world.

The third stage is 'healing mode', where a periodic job checks if any internal deltas were missed and corrects this by updating the published information. This can occur due to migration (not creating deltas), service crashes, premature shutdowns, etc.

The fourth stage involves creating a periodic dump file (or snapshot) of the published data. This allows new consumers to start from the latest snapshot instead of replaying all the small delta files from the beginning.

Note: All these steps can be turned off, but this is not the default setting.

### Setting up producer mandatees-decisions: initial sync
To ensure that the app can share data, it is necessary to set up the producers. First, ensure a significant dataset has been ingested by the consumers.

The [delta-producer-background-jobs-initiator](https://github.com/lblod/delta-producer-background-jobs-initiator) is responsible for initiating the initial sync job. To trigger this job, follow the steps below.


0. ONLY in case you are *flushing and restarting* from scratch (i.e. `rm -rf data`), ensure in  `./config/delta-producer/background-jobs-initiator/config.json`

     ```json
        [
          {
            "name": "mandatees-decisions",
            # (...) other config

            "startInitialSync": false, # changed from 'true' to 'false'

            # (...) other config

          }
        ]
     ```
     - And also ensure some data has been ingested before starting the initial sync.

1. Make sure the app is up and running, and the migrations have run.
2. In `./config/delta-producer/background-jobs-initiator/config.json` file, make sure the following
   configuration is changed:

     ```json
        [
          {
            "name": "mandatees-decisions",
            # (...) other config

            "startInitialSync": true, # changed from 'false' to 'true'

            # (...) other config

          }
        ]
     ```
3. Restart the services: `drc restart delta-producer-background-jobs-initiator`
4. You can follow the status of the job, through the dashboard frontend.
5. If the job was a success; 'normal operation mode' will take over automatically

#### Troubleshooting
Please note that the system expects this initial sync job to run only once. If something fails (or gets stuck on busy for an excessive amount of time), delete the job through the dashboard. Assuming the configuration is still the same, simply run `drc restart delta-producer-background-jobs-initiator`.
There are also other ways to trigger this job; please refer to the docs of `delta-producer-background-jobs-initiator`.
Also; if something goes wrong; the first logs to check are these of the `delta-producer-publication-graph-maintainer`.

### Setting up mandatees-decisions 'normal operation mode'
If the initial sync is successful, it should automatically work. Note that if the healing job is running, it will temporarily disable normal operation mode until the healing is finished.

### Setting up mandatees-decisions 'healing mode'
If the initial sync is successful, the default configuration will ensure healing kicks in periodically. The service for managing these jobs is again [delta-producer-background-jobs-initiator](https://github.com/lblod/delta-producer-background-jobs-initiator). Check for `./config/delta-producer/background-jobs-initiator/config.json`.
#### Troubleshooting
Please note that the system expects only one healing job to run at a time. If you want to restart it, first delete the previous healing job through the dashboard. To restart the healing job manually, please refer to the documentation of `delta-producer-background-jobs-initiator`.

Basically, it comes down to running the command:
`docker-compose exec delta-producer-background-jobs-initiator curl -X POST http://localhost/mandatees-decisions/healing-jobs`

Also; if something goes wrong; the first logs to check are these of the `delta-producer-publication-graph-maintainer`.

### Setting up mandatees-decisions dumps
Dumps are used by consumers as a snapshot to start from, this is faster than consuming all delta's. They are generated by the [delta-producer-dump-file-publisher](https://github.com/lblod/delta-producer-dump-file-publisher) which is started by a task created by the [delta-producer-background-jobs-initiator](https://github.com/lblod/delta-producer-background-jobs-initiator). The necessary config is already present in this repository, but you need to enable them by updating the config. It's recommended to set up dumps on a regular interval.

To enable dumps, edit `./config/delta-producer/background-job-initiator/config.json` enable creation by setting `disableDumpFileCreation` to `false` and set the cron pattern you need:

```diff
     "dumpFileCreationJobOperation": "http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/deltaDumpFileCreation/besluiten",
     "initialPublicationGraphSyncJobOperation": "http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/initialPublicationGraphSyncing/besluiten",
     "healingJobOperation": "http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/healingOperation/besluiten",
     "cronPatternDumpJob": "0 10 0 * * 6",
     "cronPatternHealingJob": "0 0 2 * * *",
     "startInitialSync": false,
     "errorCreatorUri": "http://lblod.data.gift/services/delta-producer-background-jobs-initiator-besluiten",
     "disableDumpFileCreation": false
   }
```

Make sure to restart the background-job-initiator service after changing the config.

Dumps will be generated in [data/files/delta-producer-dumps](data/files/delta-producer-dumps/).

```bash
docker compose restart delta-producer-background-jobs-initiator
```
### Troubleshooting
Please note that the system expects only one dump job to run at a time.
You can delete the respective job in the `jobs-dashboard`. To trigger it manually on the spot, refer to the `delta-producer-background-jobs-initiator` documentation. Also, if something goes wrong, the first logs to check are those of the `delta-producer-dump-file-publisher`.

## More Info

### Why a Separate Triple Store: Publication Triplestore?

The publication triple store was introduced for several reasons:

- The data it contains is operational data (published info) which is not the source data of your app. This makes it easier to manage code-wise, as you don't need to account for this data in your original triplestore (e.g., migrations remain the same, and the code doesn't need to consider that graph).
- Performance-wise, it is usually better for the source database since it doesn't need to manage a potential duplicate of your data.
- In some apps, this triple store is also used as the store for the landing zone of the consumer, serving as a safe space for messy (incomplete) data, which you can filter out when storing in the source database. 

It's a bit of a workaround for the future features of mu-auth.
