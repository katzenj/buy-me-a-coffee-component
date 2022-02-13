<script setup>
import { ref, computed, toRefs } from "vue";
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import WorkspaceProvider from "./WorkspaceProvider.vue";
import { sendCoffee } from "../api/send-coffee";
import {
  useAutoResizeTextarea,
  useCountCharacterLimit,
  useWorkspace,
} from "../composables/index";

// Props.
const props = defineProps({
  address: String,
});

const { address } = toRefs(props);

// Amount Input.
const amount = ref("");
const effectiveAmount = computed(() =>
  amount.value ? amount.value : getCoffeeInSol()
);

const getCoffeeInSol = async () => {
  const res = await fetch(
    "https://api.binance.com/api/v1/ticker/price?symbol=SOLUSDT"
  );
  const json = await res.json();
  const price = parseFloat(json["price"]);
  const parsedAmount = parseFloat(4 / price).toFixed(2);
  amount.value = parsedAmount;
};

// Auto-resize the content's textarea.
const textarea = ref();
useAutoResizeTextarea(textarea);

// Content.
const content = ref("");
const workspace = useWorkspace();

const characterLimit = useCountCharacterLimit(content, 140);
const characterLimitColour = computed(() => {
  if (characterLimit.value < 0) return "text-red-500";
  if (characterLimit.value <= 10) return "text-yellow-500";
  return "text-gray-400";
});

// Permissions.
const { connected } = useWallet();
const canSendCoffee = computed(
  () =>
    connected &&
    content.value &&
    characterLimit.value > 0 &&
    effectiveAmount.value != "" &&
    effectiveAmount.value > 0
);

const showModal = ref(false);

const onSendCoffeeClick = async () => {
  if (!canSendCoffee.value) return;
  const message = await sendCoffee(
    workspace,
    address.value,
    effectiveAmount.value,
    content.value
  );
  amount.value = "";
  content.value = "";
  showModal.value = false;
};
</script>

<template>
  <workspace-provider>
    <div v-if="!showModal">
      <button
        class="text-white px-4 py-2 rounded-full font-semibold bg-orange-500"
        @click="showModal = true"
      >
        Send a coffee
      </button>
    </div>

    <Transition v-if="showModal" name="modal">
      <div
        class="w-96 rounded-2xl border-x border-y shadow-lg px-10 py-8 pb-10"
      >
        <div class="flex justify-between pl-2 pb-4">
          <div class="connected-button">
            <wallet-multi-button dark></wallet-multi-button>
          </div>

          <i
            class="pt-2 hover:cursor-pointer fa-solid fa-xmark fa-lg"
            @click="showModal = false"
          ></i>
        </div>
        <div v-if="connected">
          <div class="border-2 p-4 rounded-2xl mb-4">
            <!-- Content field. -->
            <textarea
              ref="textarea"
              rows="1"
              class="text-lg w-full focus:outline-none resize-none mb-3"
              placeholder="*Say something nice*"
              v-model="content"
            ></textarea>

            <!-- Character limit. -->
            <div class="text-right" :class="characterLimitColour">
              {{ characterLimit }} left
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between -m-2">
            <!-- Coffee Input field. -->
            <div class="relative m-2 mr-4">
              <input
                type="number"
                step="0.01"
                placeholder="0.02"
                class="text-grey-500 w-32 rounded-full pl-4 pr-4 py-2 bg-gray-100 text-right"
                :value="effectiveAmount"
                @input="amount = $event.target.value"
              />
              <div
                class="absolute left-0 inset-y-0 flex pl-3 pr-2 items-center"
              >
                <p class="pb-0.5">◎</p>
              </div>
            </div>
            <div class="flex items-center space-x-6 m-2 ml-auto">
              <!-- Send Message button. -->
              <button
                class="text-white px-4 py-2 rounded-full font-semibold"
                :disabled="!canSendCoffee"
                :class="
                  canSendCoffee
                    ? 'bg-orange-500'
                    : 'bg-orange-300 cursor-not-allowed'
                "
                @click="onSendCoffeeClick"
              >
                Send Coffee
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <div v-if="false">
      <div class="pl-2">
        <wallet-multi-button dark></wallet-multi-button>
      </div>
      <div v-if="connected">
        <div class="px-8 py-4 border-b">
          <div class="border-2 p-4 rounded-2xl mb-4">
            <!-- Content field. -->
            <textarea
              ref="textarea"
              rows="1"
              class="text-lg w-full focus:outline-none resize-none mb-3"
              placeholder="*Say something nice*"
              v-model="content"
            ></textarea>

            <!-- Character limit. -->
            <div class="text-right" :class="characterLimitColour">
              {{ characterLimit }} left
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between -m-2">
            <!-- Coffee Input field. -->
            <div class="relative m-2 mr-4">
              <input
                type="number"
                step="0.01"
                placeholder="0.02"
                class="text-grey-500 w-32 rounded-full pl-4 pr-4 py-2 bg-gray-100 text-right"
                :value="effectiveAmount"
                @input="amount = $event.target.value"
              />
              <div
                class="absolute left-0 inset-y-0 flex pl-3 pr-2 items-center"
              >
                <p class="pb-0.5">◎</p>
              </div>
            </div>
            <div class="flex items-center space-x-6 m-2 ml-auto">
              <!-- Send Message button. -->
              <button
                class="text-white px-4 py-2 rounded-full font-semibold"
                :disabled="!canSendCoffee"
                :class="
                  canSendCoffee
                    ? 'bg-orange-500'
                    : 'bg-orange-300 cursor-not-allowed'
                "
                @click="onSendCoffeeClick"
              >
                Send Coffee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </workspace-provider>
</template>

<style>
.swv-button-trigger {
  background-color: white !important;
  color: black;
}
.swv-button:hover,
.swv-button-trigger:hover {
  background-color: white;
  color: black;
  cursor: pointer;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
