<script lang="ts" setup>
import { computed } from "vue";
import type { PetData } from "../../../lib/types";

const props = defineProps<{
  item: PetData;
}>();

const icon = computed(() => {
  if (props.item.specie.includes("dog")) return "dog";
  if (props.item.specie.includes("cat")) return "cat";
  if (props.item.specie.includes("bird")) return "kiwi-bird";
  return "paw";
});

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
</script>

<template>
  <div class="column gap-4px">
    <Fieldset legend="Pet Information">
      <div class="flex flex-col gap-2">
        <div class="row">
          <strong class="w-200px">Name:</strong>
          <span>{{ item.name }}</span>
        </div>
        <div class="row">
          <strong class="w-200px">Species:</strong>
          <span>
            {{ capitalize(item.specie) }}
            <FaIcon :icon="`fa-${icon}`" />
          </span>
        </div>
        <!-- <div class="row"> -->
        <!-- <strong class="w-200px">Breed:</strong> -->
        <!-- <span>{{ item.pet.breed || 'Not specified' }}</span> -->
        <!-- </div> -->
        <!-- <div class="row"> -->
        <!-- <strong class="w-200px">Date of Birth:</strong> -->
        <!-- <span>{{ item.pet.birthDate ? new Date(item.pet.birthDate).toLocaleDateString() : 'Not specified' }}</span> -->
        <!-- </div> -->
        <!-- <div class="row"> -->
        <!-- <strong class="w-200px">Owner:</strong> -->
        <!-- <span>{{ item.owner.name }} {{ item.owner.surname }}</span> -->
        <!-- </div> -->
        <!-- <div class="row"> -->
        <!-- <strong class="w-200px">Registration Date:</strong> -->
        <!-- <span>{{ new Date(item.createdAt).toLocaleDateString() }}</span> -->
        <!-- </div> -->
      </div>
    </Fieldset>

    <Fieldset legend="Additional Information" v-if="item.metadata">
      <!-- <div class="flex flex-direction-column gap-2"> -->
      <!-- <div class="row"> -->
      <!-- <strong class="w-200px">Notes:</strong> -->
      <!-- </div> -->
      <!-- <div> -->
      <!-- <p>{{ item.notes }}</p> -->
      <!-- </div> -->
      <!-- </div> -->
      <div class="row" v-for="(value, key) in item.metadata">
        <strong class="w-200px">{{ capitalize(key) }} :</strong>
        <span>{{ value }}</span>
      </div>
    </Fieldset>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  padding: 8px 0;
}
</style>
