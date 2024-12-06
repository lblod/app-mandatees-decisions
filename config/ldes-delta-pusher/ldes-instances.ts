export const ldesInstances = {
  public: {
    entities: {
      "http://data.vlaanderen.be/ns/besluit#Artikel": {
        healingPredicates: [
          "http://purl.org/dc/terms/modified",
        ],
        instanceFilter: `
        FILTER ( ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan> || ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan> )
        `
      },
      "http://data.vlaanderen.be/ns/besluit#Besluit": {
        healingPredicates: [
          "http://purl.org/dc/terms/modified",
        ],
        instanceFilter: `
        FILTER ( ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan> || ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan> )
        `
      },
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
  "http://data.vlaanderen.be/ns/besluit#Artikel": [
    "http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan",
    "http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan",
    "http://data.europa.eu/eli/ontology#date_publication",
    "http://data.europa.eu/eli/ontology#title",
  ],
  "http://data.vlaanderen.be/ns/besluit#Besluit": [
    "http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan",
    "http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan",
    "http://data.europa.eu/eli/ontology#date_publication",
    "http://data.europa.eu/eli/ontology#title",
  ],
};
