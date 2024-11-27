import { querySudo } from "@lblod/mu-auth-sudo";
import { sparqlEscapeDateTime } from 'mu'
import { CronJob } from 'cron';

import { log } from "./logger";

const CLEANUP_CRON = process.env.CRON_PATTERN_CLEANUP || '0 */2 * * *'; // Fallback is every 2 hours

export const cleanupCron = new CronJob(CLEANUP_CRON, async () => {
  console.log(`[***************************************************]`);
  console.log(` Cleaning up the public graph`);
  console.log(`[***************************************************]`);

  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const escapedTwoDaysBefore = sparqlEscapeDateTime(twoDaysAgo);
  
  log(
    `removing all triples from graph: http://mu.semte.ch/graphs/public that where last modified on ${twoDaysAgo}`,
    "debug"
  );

  await querySudo(`
    PREFIX dcterms: <http://purl.org/dc/terms/>

    DELETE {
      GRAPH <http://mu.semte.ch/graphs/public> {
        ?s ?p ?o.
      }
    }
    WHERE {
      GRAPH <http://mu.semte.ch/graphs/public> {
        ?s ?p ?o.
        ?s dcterms:modified ?modifiedDate.

        FILTER ( ?modifiedDate <= ${escapedTwoDaysBefore})
      }
    }
  `)
});
