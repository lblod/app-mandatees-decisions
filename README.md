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
