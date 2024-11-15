const regularTypes = {
  "http://data.vlaanderen.be/ns/besluit#Artikel": "public",
  "http://data.vlaanderen.be/ns/besluit#Besluit": "public",
};

export const initialization = {
  public: {
    "http://data.vlaanderen.be/ns/besluit#Artikel": {
      filter: `
        FILTER( ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan> || ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan>)
      `,
    },
    "http://data.vlaanderen.be/ns/besluit#Besluit": {
      filter: `
        FILTER( ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtAanstellingVan> || ?p = <http://data.vlaanderen.be/ns/mandaat#bekrachtigtOntslagVan>)
      `,
    },
  },
};

Object.keys(regularTypes).forEach((type) => {
  const level = regularTypes[type];
  if (level === "public") {
    initialization.public[type] = {};
  } 
});