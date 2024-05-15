import Web3 from "web3";
import { VeridaCredentialRecord } from "@verida/verifiable-credentials";
import { Schema, ZkPassResult } from "../@types";
import { Proof, Reclaim } from "@reclaimprotocol/js-sdk";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import { ZKPASS_APP_ID } from "../config/config";

const web3 = new Web3();
export const verifyZKProof = (proof: VeridaCredentialRecord): boolean => {
  try {
    const { credentialData } = proof;
    const {
      taskId,
      zkPassSchemaId,
      validatorAddress,
      allocatorSignature,
      uHash,
      publicFields,
      publicFieldsHash,
      validatorSignature,
      allocatorAddress,
    } = credentialData as ZkPassResult;

    // verify allocator signature
    const taskIdHex = Web3.utils.stringToHex(taskId);
    const schemaIdHex = Web3.utils.stringToHex(zkPassSchemaId);
    const encodeParams = web3.eth.abi.encodeParameters(
      ["bytes32", "bytes32", "address"],
      [taskIdHex, schemaIdHex, validatorAddress]
    );
    const paramsHash = Web3.utils.soliditySha3(encodeParams);
    const signedAllocationAddress = web3.eth.accounts.recover(
      paramsHash,
      allocatorSignature
    );

    if (signedAllocationAddress !== allocatorAddress) {
      return false;
    }

    // verify validator signature
    const encodeParamsForValidator = web3.eth.abi.encodeParameters(
      ["bytes32", "bytes32", "bytes32", "bytes32"],
      [taskIdHex, schemaIdHex, uHash, publicFieldsHash]
    );
    const paramsHashForValidator = Web3.utils.soliditySha3(
      encodeParamsForValidator
    );
    const signedValidatorAddress = web3.eth.accounts.recover(
      paramsHashForValidator,
      validatorSignature
    );

    if (signedValidatorAddress !== validatorAddress) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("something went wrong while verify result from zk: ", err);
    return false;
  }
};

export const verifyReclaimProof = async (
  proof: VeridaCredentialRecord
): Promise<boolean> => {
  try {
    const { credentialData } = proof;
    // verify proof
    const isProofVerified = await Reclaim.verifySignedProof(
      credentialData as unknown as Proof
    );
    if (!isProofVerified) {
      return false;
    }

    // verify metadata
    // TODO We don't need other business logic with this proof for now
    // If we need another functionality, then we will need to do something to verify specific fiels here
    const { claimData } = credentialData as unknown as Proof;
    if (!claimData?.provider) {
      return false;
    }

    return true;
  } catch (err) {
    console.log("something went wrong while verify result from reclaim: ", err);
    return false;
  }
};

export const checkZkTransgateAvailable = async (schema: Schema): Promise<boolean> => {
  if (!schema || schema.src !== "zkPass") return;
  const connector = new TransgateConnect(ZKPASS_APP_ID);
  // Check if the TransGate extension is installed
  // If it returns false, please prompt to install it from chrome web store
  const isAvailable = await connector.isTransgateAvailable();
  return isAvailable;
};
