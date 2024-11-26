import { querySudo } from "@lblod/mu-auth-sudo";
import { CronJob } from 'cron';

import { log } from "./logger";

const CLEANUP_CRON = process.env.CRON_PATTERN_CLEANUP || '0 */2 * * *'; // Fallback is every 2 hours

export const cleanupCron = new CronJob(CLEANUP_CRON, async () => {
  console.log(`[***************************************************]`);
  console.log(` Cleaning up the public graph`);
  console.log(`[***************************************************]`);

  log(
    `Removing all non interesting subjects from graph: http://mu.semte.ch/graphs/public`,
    "debug"
  );

  await querySudo(`
    DELETE {
      GRAPH <http://mu.semte.ch/graphs/public> {
        ?s ?p ?o.
      }
    }
    WHERE {
      GRAPH <http://mu.semte.ch/graphs/public> {
        ?s a ?type.
        ?s ?p ?o.

        OPTIONAL {
          ?s a ?otherType.
        }
      }
      FILTER (
        ?type != <http://data.vlaanderen.be/ns/besluit#Artikel> ||
        ?type != <http://data.vlaanderen.be/ns/besluit#Besluit>
      )
      BIND(IF(BOUND(?otherType), ?otherType, <http://other>) AS ?safeOtherType)    
      FILTER (
        ?safeOtherType != <http://data.vlaanderen.be/ns/besluit#Artikel> ||
        ?safeOtherType != <http://data.vlaanderen.be/ns/besluit#Besluit>
      )
    }
  `)
});
