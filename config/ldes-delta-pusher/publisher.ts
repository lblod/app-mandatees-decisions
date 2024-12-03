import { sparqlEscapeUri, sparqlEscape } from "mu";
import { querySudo } from "@lblod/mu-auth-sudo";
import { addData, getConfigFromEnv } from "@lblod/ldes-producer";

import { LDES_FRAGMENTER } from "../config";
import { log } from "./logger";
import {
  defaultProperties,
  officialPredicates,
} from "./ldes-instances";

const ldesProducerConfig = getConfigFromEnv();

export type LDES_TYPE = "public";
export type TypesWithFilter = {
  [key in LDES_TYPE]: {
    filter?: string;
  };
};
export type InterestingSubject = {
  uri: string;
  type: string;
  ldesType: LDES_TYPE | TypesWithFilter;
  filter?: string;
};

const fetchSubjectData = async (
  subject: InterestingSubject,
  target: string
) => {
  let predicateLimiter = "";
  if (["public"].includes(target) && officialPredicates[subject.type]) {
    let properties = officialPredicates[subject.type];
    properties = properties.concat(defaultProperties);
    predicateLimiter = `
    VALUES ?p {
      ${properties.map((p) => sparqlEscapeUri(p)).join("\n")}
    }`;
  }
  const filter =
    typeof subject.ldesType === "object" && subject.ldesType[target].filter
      ? subject.ldesType[target].filter
      : "";

  // we are also publishing the bestuurseenheid with our data so consuming apps easily know where to put the concept
  const data = await querySudo(`
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    CONSTRUCT {
      ${sparqlEscapeUri(subject.uri)} ?p ?o .
    } WHERE {
      GRAPH ?g {
        ${sparqlEscapeUri(subject.uri)} ?p ?o .
      }
      ${predicateLimiter}
      ${filter}
    }
  `);
  return data.results.bindings.map(bindingToTriple).join("\n");
};

const datatypeNames = {
  "http://www.w3.org/2001/XMLSchema#dateTime": "dateTime",
  "http://www.w3.org/2001/XMLSchema#date": "date",
  "http://www.w3.org/2001/XMLSchema#decimal": "decimal",
  "http://www.w3.org/2001/XMLSchema#integer": "int",
  "http://www.w3.org/2001/XMLSchema#float": "float",
  "http://www.w3.org/2001/XMLSchema#boolean": "bool",
};

const sparqlEscapeObject = (bindingObject): string => {
  const escapeType = datatypeNames[bindingObject.datatype] || "string";
  return bindingObject.type === "uri"
    ? sparqlEscapeUri(bindingObject.value)
    : sparqlEscape(bindingObject.value, escapeType);
};

export const bindingToTriple = (binding) =>
  `${sparqlEscapeUri(binding.s.value)} ${sparqlEscapeUri(
    binding.p.value
  )} ${sparqlEscapeObject(binding.o)} .`;

/**
 * Publish the currently known info for the given subject URI to the LDES endpoint of the given type
 * @param ldesType the type of the LDES endpoint to publish to (e.g. "public" or "abb")
 * @param subject the uri of the subject to fetch data for and publish
 */
export const publish = async (
  subject: InterestingSubject,
  additionalTriples?: string
) => {
  await Promise.all(
    ["public"].map(async (target) => {
      let data = await fetchSubjectData(subject, target);
      if (additionalTriples) {
        data = `${data}\n${additionalTriples}`;
      }

      log(
        `[${target}] Publishing data for subject ${subject.uri}:\n${data}`,
        "debug"
      );
      const safeData = `@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n${data}`;

      await addData(ldesProducerConfig, {
        contentType: "text/turtle",
        folder: target,
        body: safeData,
        fragmenter: LDES_FRAGMENTER,
      });
    })
  );
};
