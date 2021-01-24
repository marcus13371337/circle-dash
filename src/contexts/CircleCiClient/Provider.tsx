import CircleCI from "circle-client";
import { createContext } from "react";
import { config } from "../../config";
import { CircleCI as LegacyCircleCI } from "circleci-api";

export interface CircleCiClientContextType {
  client: CircleCI;
  legacyClient: LegacyCircleCI;
}

if (!config.accessToken) {
  throw new Error("Access token not configured");
}

const client = new CircleCI(config.accessToken);
const legacyClient = new LegacyCircleCI({ token: config.accessToken });

export const CircleCiClientContext = createContext<CircleCiClientContextType>({
  client,
  legacyClient,
});
