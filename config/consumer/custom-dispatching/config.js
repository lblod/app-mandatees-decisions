const DEFAULT_STAGING_GRAPH = 'http://mu.semte.ch/graphs/staging'
const DEFAULT_TARGET_GRAPH = 'http://mu.semte.ch/graphs/public'
const DEFAULT_DATABASE_ENDPOINT = 'http://database:8890/sparql'

if (!process.env.DCR_LANDING_ZONE_GRAPH)
  console.log(
    '\t Using the the default STAGING_GRAPH => ',
    DEFAULT_STAGING_GRAPH
  )
if (!process.env.TARGET_GRAPH)
  console.log('\t Using the the default TARGET_GRAPH => ', DEFAULT_TARGET_GRAPH)
if (!process.env.DATABASE_ENDPOINT)
  console.log(
    '\t Using the the default TARGET_DATABASE_ENDPOINT => ',
    DEFAULT_DATABASE_ENDPOINT
  )

const STAGING_GRAPH =
  process.env.DCR_LANDING_ZONE_GRAPH || DEFAULT_STAGING_GRAPH
const TARGET_GRAPH = process.env.TARGET_GRAPH || DEFAULT_TARGET_GRAPH

const DATABASE_ENDPOINT =
  process.env.TARGET_DATABASE_ENDPOINT || DEFAULT_DATABASE_ENDPOINT

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 100

module.exports = {
  STAGING_GRAPH,
  TARGET_GRAPH,
  DATABASE_ENDPOINT,
  BATCH_SIZE,
}
