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
