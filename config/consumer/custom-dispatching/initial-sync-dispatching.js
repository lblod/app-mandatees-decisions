const {
  DATABASE_ENDPOINT,
  STAGING_GRAPH,
  BATCH_SIZE,
  INTERESTING_TYPES,
  TARGET_GRAPH,
} = require('./config')
const {
  triplesToGraph,
  addModifiedToSubjects,
  statementToStringTriple,
  insertTriplesOfTypesInGraph,
} = require('./util')

/**
 * Dispatch the fetched information to a target graph.
 * @param { mu, muAuthSudo, fetch } lib - The provided libraries from the host service.
 * @param { termObjects } data - The fetched quad information, which objects of serialized Terms
 *          [ {
 *              graph: "<http://foo>",
 *              subject: "<http://bar>",
 *              predicate: "<http://baz>",
 *              object: "<http://boom>^^<http://datatype>"
 *            }
 *         ]
 * @return {void} Nothing
 */
async function dispatch(lib, data) {
  const { mu, muAuthSudo } = lib
  const triples = data.termObjects
  const triplesAsString = triples.map((triple) =>
    statementToStringTriple(triple)
  )

  // Inserting all the triples into our staging graph
  await triplesToGraph(
    muAuthSudo.updateSudo,
    DATABASE_ENDPOINT,
    BATCH_SIZE,
    STAGING_GRAPH,
    triplesAsString
  )

  // For cleanup purposes we add a modified predicate to each subject
  await addModifiedToSubjects(
    muAuthSudo.updateSudo,
    DATABASE_ENDPOINT,
    BATCH_SIZE,
    triples.map((triple) => triple.subject),
    STAGING_GRAPH
  )

  // Inserting all the triples of subjects that are of an interesting type
  await insertTriplesOfTypesInGraph(
    mu,
    muAuthSudo.updateSudo,
    DATABASE_ENDPOINT,
    INTERESTING_TYPES,
    STAGING_GRAPH,
    TARGET_GRAPH
  )
}

/**
 * A callback you can override to do extra manipulations
 *   after initial ingest.
 * @param { mu, muAuthSudo, fech } lib - The provided libraries from the host service.
 * @return {void} Nothing
 */
async function onFinishInitialIngest(lib) {
  console.log(`
    Current implementation does nothing.
  `)
}

module.exports = {
  dispatch,
  onFinishInitialIngest,
}
