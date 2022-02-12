// CSS.
import "solana-wallets-vue/styles.css";
import "./main.css";

// Wallets.
import SolanaWallets from "solana-wallets-vue";

import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SlopeWalletAdapter(),
    new SolflareWalletAdapter({ network: "devnet" }),
  ],
  autoConnect: true,
};

import { createApp } from "vue";
import { Buffer } from "buffer";
import App from "./App.vue";
window.Buffer = Buffer;

createApp(App).use(SolanaWallets, walletOptions).mount("#app");
