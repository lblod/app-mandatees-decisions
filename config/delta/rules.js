export default [
  {
    match: {
      predicate: {
        type: 'uri',
        value: 'http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan'
      },
      graph: {
        type: 'uri',
        value: 'http://mu.semte.ch/graphs/consumed-decisions'
      }
    },
    callback: {
      url: "http://ldes-delta-pusher/publish",
      method: "POST",
    },
    options: {
      resourceFormat: "v0.0.1",
      gracePeriod: 10000,
      retry: 3,
      retryTimeout: 250,
    },
  },
  {
    match: {
      predicate: {
        type: 'uri',
        value: 'http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan'
      },
      graph: {
        type: 'uri',
        value: 'http://mu.semte.ch/graphs/consumed-decisions'
      }
    },
    callback: {
      url: "http://ldes-delta-pusher/publish",
      method: "POST",
    },
    options: {
      resourceFormat: "v0.0.1",
      gracePeriod: 10000,
      retry: 3,
      retryTimeout: 250,
    },
  },

  {
    match: {
      subject: {},
    },
    callback: {
      url: 'http://modified/delta',
      method: 'POST',
    },
    options: {
      resourceFormat: 'v0.0.1',
      gracePeriod: 10000,
      retry: 3,
      ignoreFromSelf: true,
      retryTimeout: 250,
    },
  },
];
