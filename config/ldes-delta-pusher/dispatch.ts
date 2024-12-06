import { Changeset } from "../types";
import { querySudo } from "@lblod/mu-auth-sudo";
import { sparqlEscapeUri } from "mu";

import { publishInterestingSubjects } from "./handle-types-util";
import { InterestingSubject } from "./publisher";
import { cleanupCron } from './cleanup';

export default async function dispatch(changesets: Changeset[]) {
  await publishInterestingSubjects(changesets, interestingSubjects);
}

cleanupCron.start();

const interestingSubjects = async (
  subjects: string[]
): Promise<InterestingSubject[]> => {
  const types = [
    "http://data.vlaanderen.be/ns/besluit#Artikel",
    "http://data.vlaanderen.be/ns/besluit#Besluit"
  ];
  const matches = await querySudo(`
    PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>

    SELECT DISTINCT ?s ?type
    WHERE {
      GRAPH ?g {
        ?s a ?type .
        VALUES ?type { ${types.map((type) => sparqlEscapeUri(type)).join(" ")} }
        VALUES ?s { ${[...subjects]
      .map((subject) => sparqlEscapeUri(subject))
      .join(" ")} }

        ?s ?predicate ?mandataris.
        FILTER ( ?predicate = mandaat:bekrachtigtAanstellingVan || ?predicate = mandaat:bekrachtigtOntslagVan )
      }
    }
  `);
  return matches.results.bindings
    .map((binding) => {
      return { uri: binding.s.value, ldesType: "public", type: binding.type.value };
    })
    .filter((b) => !!b);
};


