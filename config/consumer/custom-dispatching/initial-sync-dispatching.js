const { DATABASE_ENDPOINT, STAGING_GRAPH, BATCH_SIZE } = require('./config')
const {
  triplesToGraph,
  addModifiedToSubjects,
  statementToStringTriple,
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
  const { muAuthSudo } = lib
  const triples = data.termObjects
  const triplesAsString = data.termObjects.map((triple) =>
    statementToStringTriple(triple)
  )

  await triplesToGraph(
    muAuthSudo.updateSudo,
    DATABASE_ENDPOINT,
    BATCH_SIZE,
    STAGING_GRAPH,
    triplesAsString
  )

  await addModifiedToSubjects(
    muAuthSudo.updateSudo,
    DATABASE_ENDPOINT,
    BATCH_SIZE,
    triples.map((triple) => triple.subject),
    STAGING_GRAPH
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
