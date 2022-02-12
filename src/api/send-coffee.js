import { web3, BN } from "@project-serum/anchor";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const sendCoffee = async ({ wallet, program }, to, amount, content) => {
  const message = web3.Keypair.generate();
  const toKey = new PublicKey(to);
  const amountInLamports = new BN(amount * LAMPORTS_PER_SOL);
  await program.value.rpc.sendCoffee(amountInLamports, content, {
    accounts: {
      from: wallet.value.publicKey,
      to: toKey,
      message: message.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [message],
  });

  // const messageAccount = await program.value.account.message.fetch(
  //   message.publicKey
  // );

  return true;
};
