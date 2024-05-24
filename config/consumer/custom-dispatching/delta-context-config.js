const PREFIXES = `
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>`

const contextConfig = {
  addTypes: {
    scope: 'all',
    exhausitive: false,
  },
  contextQueries: [
    {
      trigger: {
        subjectType: 'mandaat:Mandataris',
      },
      queryTemplate: (subject) => `
        ${PREFIXES}
        CONSTRUCT {
          ?mandataris ?p ?o .
        } WHERE {
          GRAPH <http://mu.semte.ch/graphs/landing-zone> {
            ?mandataris a mandaat:Mandataris .
          }
        }`,
    },
    {
      trigger: {
        subjectType: 'besluit:Artikel',
      },
      queryTemplate: (subject) => `
        ${PREFIXES}
        CONSTRUCT {
          ?artikel ?p ?o .
        } WHERE {
          GRAPH <http://mu.semte.ch/graphs/landing-zone> {
            ?artikel a besluit:Artikel .
          }
        }`,
    },
    {
      trigger: {
        subjectType: 'besluit:Besluit',
      },
      queryTemplate: (subject) => `
        ${PREFIXES}
        CONSTRUCT {
          ?besluit ?p ?o .
        } WHERE {
          GRAPH <http://mu.semte.ch/graphs/landing-zone> {
            ?besluit a besluit:Besluit .
          }
        }`,
    },
  ],
}

module.exports = {
  contextConfig,
  PREFIXES,
}
