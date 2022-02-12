<script setup>
import { ref, computed, toRefs } from "vue";
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import WorkspaceProvider from "./WorkspaceProvider.vue";
import { sendCoffee } from "../api/send-coffee";
import {
  useAutoResizeTextarea,
  useCountCharacterLimit,
  useWorkspace,
} from "../composables";

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
          <wallet-multi-button dark></wallet-multi-button>
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
/* .modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 400px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.8s ease;
} */
/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
