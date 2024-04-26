export type Schema = {
  id: string;
  title: string;
  host: string;
  icon: string;
  type: string;
  description: string;
  src: "zkPass" | "reclaim";
};

export type ZkPassResult = {
  allocatorAddress: string;
  allocatorSignature: string;
  publicFields: any[];
  publicFieldsHash: string;
  taskId: string;
  uHash: string;
  validatorAddress: string;
  validatorSignature: string;
  zkPassSchemaId?: string;
  zkPassSchemaLabel?: string;
};

type ReclaimClaimData = {
  provider: string;
  parameters: string;
  identifier: string;
  epoch: string;
};
type ReclaimProof = {
  identifier: string;
  claimData: ReclaimClaimData;
  signature: string;
};
export type ReclaimResult = {
  appId: string;
  httpProviderId: string[];
  proofs: ReclaimProof[];
  sessionId: string;
  reclaimProviderId: string;
  reclaimProviderLabel: string;
};