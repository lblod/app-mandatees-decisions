async function triplesToGraph(
  muUpdate,
  endpoint,
  batchSize,
  graph,
  triples,
  insert = true
) {
  let operation = 'INSERT'

  if (!insert) {
    operation = 'DELETE'
  }

  for (let index = 0; index < triples.length; index += batchSize) {
    const tripleBatch = triples.slice(index, index + batchSize).join('\n')
    const query = `
      ${operation} DATA {
        GRAPH <${graph}> {
        ${tripleBatch}
        }
      }
    `
    await muUpdate(query, {}, endpoint)
    await new Promise((r) => setTimeout(r, 1000))
  }
}

async function addModifiedToSubjects(
  muUpdate,
  endpoint,
  batchSize,
  subjects,
  graph
) {
  const query = (batchUris) => `
      DELETE {
        GRAPH <${graph}> {
            ?s <http://mu.semte.ch/vocabularies/ext/modifiedReference> ?o .
        }
      }
      INSERT {
        GRAPH <${graph}> {
          ?s <http://mu.semte.ch/vocabularies/ext/modifiedReference> "${new Date().toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime>
        }
      }
      WHERE {
        VALUES ?s { ${batchUris} }
        GRAPH <${graph}> {
          ?s a ?type .

          OPTIONAL {
            ?s <http://mu.semte.ch/vocabularies/ext/modifiedReference> ?o .
          }
        }
      }
    `

  for (let index = 0; index < subjects.length; index += batchSize) {
    const batchUris = subjects.slice(index, index + batchSize).join(' ')
    await muUpdate(query(batchUris), {}, endpoint)
  }
}

async function insertTriplesOfTypesInGraph(
  mu,
  muUpdate,
  endpoint,
  types,
  fromGraph,
  toGraph
) {
  const query = `
    DELETE {
      GRAPH ${mu.sparqlEscapeUri(toGraph)} {
        ?s ?p ?o .
      }
    } INSERT {
      GRAPH ${mu.sparqlEscapeUri(toGraph)} {
        ?s ?p ?o .
      }
    } WHERE {
      VALUES ?type { ${types
        .map((type) => mu.sparqlEscapeUri(type))
        .join(' ')} }
      GRAPH ${mu.sparqlEscapeUri(fromGraph)} {
        ?s a ?type .
        ?s ?p ?o .
      }
    }
  `
  await muUpdate(query, {}, endpoint)
}

function statementToStringTriple(statement) {
  try {
    return `${statement.subject} ${statement.predicate} ${statement.object}.`
  } catch (error) {
    throw `Could not create string triple for statement`
  }
}

module.exports = {
  triplesToGraph,
  addModifiedToSubjects,
  statementToStringTriple,
  insertTriplesOfTypesInGraph,
}
