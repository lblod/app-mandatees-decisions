const regularTypes = {
  "http://data.vlaanderen.be/ns/besluit#Artikel": "public",
  "http://data.vlaanderen.be/ns/besluit#Besluit": "public",
};

export const initialization = {
  public: {
    "http://data.vlaanderen.be/ns/besluit#Artikel": {
      filter: `
        ?s ?p ?o.
        FILTER( ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan> || ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan>)
      `,
    },
    "http://data.vlaanderen.be/ns/besluit#Besluit": {
      filter: `
        ?s ?p ?o.
        FILTER( ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan> || ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan>)
      `,
    },
  },
};