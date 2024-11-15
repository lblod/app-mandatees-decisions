import { Changeset } from "../types";
import { handleAllTypes } from "./handle-all-type";

export default async function dispatch(changesets: Changeset[]) {
  handleAllTypes(changesets);
}

