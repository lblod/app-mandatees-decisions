const { STAGING_GRAPH } = require('./config')

const PREFIXES = `
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
PREFIX person: <http://www.w3.org/ns/person#>`

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
          GRAPH <${STAGING_GRAPH}> {
            ?mandataris a mandaat:Mandataris .
          }
        }`,
    },
    {
      trigger: {
        subjectType: 'person:Person',
      },
      queryTemplate: (subject) => `
        ${PREFIXES}
        CONSTRUCT {
          ?person ?p ?o .
        } WHERE {
          GRAPH <${STAGING_GRAPH}> {
            ?person a person:Person .
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
          GRAPH <${STAGING_GRAPH}> {
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
