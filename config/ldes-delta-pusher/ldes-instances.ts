import { ARTIKEL_TYPE_URI, BESLUIT_TYPE_URI } from './handle-types-util';

export const ldesInstances = {
  public: {
    entities: {
      ARTIKEL_TYPE_URI: {},
      BESLUIT_TYPE_URI: {},
    },
  }
};

export const defaultProperties = [
  "http://purl.org/dc/terms/modified",
  "http://www.w3.org/2002/07/owl#sameAs",
  "http://mu.semte.ch/vocabularies/core/uuid",
  "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
];

export const officialPredicates = {
  ARTIKEL_TYPE_URI: [
    "http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan",
    "http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan",
    "http://data.europa.eu/eli/ontology#date_publication",
    "http://data.europa.eu/eli/ontology#title",
  ],
  BESLUIT_TYPE_URI: [
    "http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan",
    "http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan",
    "http://data.europa.eu/eli/ontology#date_publication",
    "http://data.europa.eu/eli/ontology#title",
  ],
};
