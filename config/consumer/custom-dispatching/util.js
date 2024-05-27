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

async function addModifiedToSubjects(muUpdate, endpoint, subjects, graph) {
  for (const subject of subjects) {
    const query = `
      DELETE {
        ${subject} <http://mu.semte.ch/vocabularies/ext/modifiedReference> ?o .
      }
      INSERT DATE {
        GRAPH <${graph}> {
        ${subject} <http://mu.semte.ch/vocabularies/ext/modifiedReference> "${new Date().toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime>
        }
      }
      WHERE {
        ${subject} <http://mu.semte.ch/vocabularies/ext/modifiedReference> ?o .
      }
    `

    await muUpdate(query, {}, endpoint)
  }
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
}
