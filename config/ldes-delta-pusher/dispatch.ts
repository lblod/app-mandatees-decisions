import { Changeset } from "../types";
import { querySudo } from "@lblod/mu-auth-sudo";

import { ARTIKEL_TYPE_URI, BESLUIT_TYPE_URI, publishInterestingSubjects } from "./handle-types-util";
import { InterestingSubject } from "./publisher";

export default async function dispatch(changesets: Changeset[]) {
  await publishInterestingSubjects(changesets, interestingSubjects);
}

const interestingSubjects = async (
  subjects: string[]
): Promise<InterestingSubject[]> => {
  const types = [
    ARTIKEL_TYPE_URI,
    BESLUIT_TYPE_URI
  ];
  const matches = await querySudo(`
    PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>

    SELECT DISTINCT ?s ?type
    WHERE {
      GRAPH ?g {
        ?s a ?type .
        VALUES ?type { ${types.map((type) => `<${type}>`).join(" ")} }
        VALUES ?s { ${[...subjects]
      .map((subject) => `<${subject}>`)
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

