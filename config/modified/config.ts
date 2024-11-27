import { Changeset } from '../types';

export const interestingTypes = [
  'http://data.vlaanderen.be/ns/besluit#Artikel',
  'http://data.vlaanderen.be/ns/besluit#Besluit',
];

export const filterModifiedSubjects = '';

export async function filterDeltas(changeSets: Changeset[]) {
  const modifiedPred = 'http://purl.org/dc/terms/modified';
  const subjectsWithModified = new Set();

  const trackModifiedSubjects = (quad) => {
    if (quad.predicate.value === modifiedPred) {
      subjectsWithModified.add(quad.subject.value);
    }
  };
  changeSets.map((changeSet) => {
    changeSet.inserts.forEach(trackModifiedSubjects);
    changeSet.deletes.forEach(trackModifiedSubjects);
  });

  const isGoodQuad = (quad) => !subjectsWithModified.has(quad.subject.value);
  return changeSets.map((changeSet) => {
    return {
      inserts: changeSet.inserts.filter(isGoodQuad),
      deletes: changeSet.deletes.filter(isGoodQuad),
    };
  });
}