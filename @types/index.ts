export enum VeridaMessageType {
  SIMPLE_MESSAGE = "inbox/type/message",
  DATA_MESSAGE = "inbox/type/dataSend",
  DATA_REQUEST = "inbox/type/dataRequest",
}

export type Schema = {
  id: string;
  title: string;
  host: string;
  icon: string;
  type: string;
  description: string;
  message: string;
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


export type SendDataRequestData = {
  requestSchema: string;
  filter?: Record<string, unknown>;
  userSelectLimit?: number;
  userSelect?: boolean;
};

export type SendDataRequestOptions = SendDataRequestData & {
  messageSubject: string;
};

export type SentMessage = {
  id: string;
  ok: boolean;
  rev: string;
};

export type DataMessage = {
  message: object;
};

export type SendMessageData<D> = {
  data: D[];
};

export type SendDataMessageOptions = DataMessage & {
  messageSubject?: string;
  targetDid?: string;
  targetContext?: string;
};


export type ReceivedMessage<D> = {
  type: VeridaMessageType;
  read: boolean;
  sentAt: string;
  message: string;
  sentBy: {
    context: string;
    did: string;
  };
  data: {
    data: D[];
    replyId?: string;
  };
};

export type VerificationResult = {
  result: boolean;
  veridaDid: string;
  credentialSchema: string,
  credentialData: Record<string, string | object>;
}