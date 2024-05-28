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
 * @param { termObjectChangeSets: { deletes, inserts } } data - The fetched changes sets, which objects of serialized Terms
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
  const { termObjectChangeSets } = data

  for (let { deletes, inserts } of termObjectChangeSets) {
    // NOTE: this code is not yet tested as we cannot trigger a delta sync dispatch
    await triplesToGraph(
      muAuthSudo.updateSudo,
      DATABASE_ENDPOINT,
      BATCH_SIZE,
      STAGING_GRAPH,
      deletes.map((triple) => statementToStringTriple(triple)),
      false // This means it is deleting the triples
    )
    await triplesToGraph(
      muAuthSudo.updateSudo,
      DATABASE_ENDPOINT,
      BATCH_SIZE,
      STAGING_GRAPH,
      inserts.map((triple) => statementToStringTriple(triple))
    )

    await addModifiedToSubjects(
      muAuthSudo.updateSudo,
      DATABASE_ENDPOINT,
      BATCH_SIZE,
      inserts.map((triple) => triple.subject),
      STAGING_GRAPH
    )

    await insertTriplesOfTypesInGraph(
      mu,
      muAuthSudo.updateSudo,
      DATABASE_ENDPOINT,
      INTERESTING_TYPES,
      STAGING_GRAPH,
      TARGET_GRAPH
    )
  }
}

module.exports = {
  dispatch,
}
