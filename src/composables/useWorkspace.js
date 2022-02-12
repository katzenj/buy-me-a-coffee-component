import { computed } from "vue";
import { useAnchorWallet } from "solana-wallets-vue";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Provider, Program } from "@project-serum/anchor";
import idl from "../idl/buy_me_a_coffee.json";

const preflightCommitment = "processed";
const commitment = "processed";
const programID = new PublicKey(idl.metadata.address);

let workspace = null;
export const useWorkspace = () => workspace;

export const initWorkspace = () => {
  const wallet = useAnchorWallet();
  const connection = new Connection(clusterApiUrl("devnet"), commitment);
  const provider = computed(
    () =>
      new Provider(connection, wallet.value, {
        preflightCommitment,
        commitment,
      })
  );
  const program = computed(() => new Program(idl, programID, provider.value));

  workspace = {
    wallet,
    connection,
    provider,
    program,
  };
};
