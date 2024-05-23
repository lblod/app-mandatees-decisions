const PREFIXES = `
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>`

const contextConfig = {
  addTypes: {
    scope: 'all',
    exhausitive: false,
  },
  contextQueries: [
    {
      trigger: {
        subjectType: 'besluit:Besluit',
      },
      queryTemplate: (subject) => `
        ${PREFIXES}
        CONSTRUCT {
          ?artikel a besluit:Besluit .
          ?artikel ?p ?o .
        } WHERE {
          GRAPH <http://mu.semte.ch/graphs/public> {
            ?besluit a besluit:Besluit .
            ?besluit ?p ?o .
          }
        }`,
    },
  ],
}

export default {
  contextConfig,
  PREFIXES,
}
