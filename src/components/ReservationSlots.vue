<script lang="ts" setup>
import { ref } from "vue";
import type { ReservationSlotsType } from "../models/reservation";
const props = defineProps({
  slots: {
    type: Array as () => ReservationSlotsType,
    required: true,
  },
});
const emits = defineEmits<{ selectedSlot: [any] }>();
const selectedSlot = ref<number>(-1);

const onSlotClick = (i: number) => (_ev: MouseEvent) => {
  selectedSlot.value = i;
  emits("selectedSlot", props.slots[i]);
};
</script>
<template>
  <div class="date-slot-container">
    <h2>Available Dates</h2>
    <div
      @click="(ev) => onSlotClick(i)(ev)"
      v-for="(slot, i) in slots"
      class="date-slot"
      :class="selectedSlot == i ? 'selected' : ''"
      :key="i"
    >
      <span>{{ slot.from }}</span>
      <span>{{ slot.to }}</span>
    </div>
  </div>
</template>
<style>
.date-slot-container {
  /*  -webkit-text-stroke: 1px;*/
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  gap: 5px;
  width: 100%;
  height: 100%;
}

.date-slot {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #0004;
  padding: 10px;
  border-radius: 5px;

  &.selected {
    background-color: #0002;
    /*    -webkit-text-stroke: 2px;*/
    font-weight: bold;
  }

  &:hover {
    &:not(.selected) {
      background-color: #0001;
      font-weight: bold;
    }
    cursor: pointer;
  }
}
</style>
