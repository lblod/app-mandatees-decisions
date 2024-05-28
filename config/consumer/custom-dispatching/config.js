const DEFAULT_STAGING_GRAPH = 'http://mu.semte.ch/graphs/staging'
const DEFAULT_TARGET_GRAPH = 'http://mu.semte.ch/graphs/public'
const DEFAULT_DATABASE_ENDPOINT = 'http://database:8890/sparql'
const DEFAULT_INTERESTING_TYPES = 'http://data.vlaanderen.be/ns/besluit#Besluit'

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

if (!process.env.INTERESTING_TYPES)
  console.log(
    '\t Using the the default INTERESTING_TYPES => ',
    DEFAULT_INTERESTING_TYPES
  )

const STAGING_GRAPH =
  process.env.DCR_LANDING_ZONE_GRAPH || DEFAULT_STAGING_GRAPH
const TARGET_GRAPH = process.env.TARGET_GRAPH || DEFAULT_TARGET_GRAPH

const DATABASE_ENDPOINT =
  process.env.TARGET_DATABASE_ENDPOINT || DEFAULT_DATABASE_ENDPOINT

const BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 100
const INTERESTING_TYPES =
  commaSeparatedStringToArray(process.env.INTERESTING_TYPES) ||
  commaSeparatedStringToArray(DEFAULT_INTERESTING_TYPES)

function commaSeparatedStringToArray(string) {
  if (!string) {
    return null
  }

  return string
    .split(',')
    .map((type) => type.trim())
    .filter((type) => type)
}

module.exports = {
  STAGING_GRAPH,
  TARGET_GRAPH,
  DATABASE_ENDPOINT,
  BATCH_SIZE,
  INTERESTING_TYPES,
}
