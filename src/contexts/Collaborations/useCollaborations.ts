import { useContext } from "react";
import { CollaborationsContext } from "./Provider";

export const useCollaborations = () => useContext(CollaborationsContext);
