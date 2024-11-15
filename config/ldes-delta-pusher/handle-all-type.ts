import { Changeset } from "../types";
import { querySudo } from "@lblod/mu-auth-sudo";

import { publishInterestingSubjects } from "./handle-types-util";
import { InterestingSubject } from "./publisher";

const interestingSubjects = async (
  subjects: string[]
): Promise<InterestingSubject[]> => {
  const matches = await querySudo(`
    PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>

    SELECT DISTINCT ?s ?type
    WHERE {
      GRAPH ?g {
        ?s a ?type .
        VALUES ?s { ${[...subjects]
      .map((subject) => `<${subject}>`)
      .join(" ")} }
        ?s ?p ?o.
      }
    }
  `);
  return matches.results.bindings
    .map((binding) => {
      return { uri: binding.s.value, ldesType: "public", type: binding.type.value };
    })
    .filter((b) => !!b);
};

export const handleAllTypes = async (changesets: Changeset[]) => {
  await publishInterestingSubjects(changesets, interestingSubjects);
};
