import { Collaboration } from "circle-client";

export const getOrgSlug = (collaboration: Collaboration) => {
  return `${(collaboration as any).vcs_type}/${collaboration.name}`;
};
