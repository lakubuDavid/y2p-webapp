<!-- /apps/webapp/src/components/dialog/NewPetDialog.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";
import MetadataEditor from "../MetadataEditor.vue";
import type { CreatePetParams } from "@lib/schemas";

const props = defineProps<{
  handleSubmit: (data: CreatePetParams) => Promise<any>;
  handleCancel?: () => void | Promise<void>;
}>();

const form = ref<CreatePetParams>({
  name: "",
  specie: "",
  metadata: {},
  // other fields...
});

const otherSpecie = ref<string>();

const selectedSpecie = computed(() => {
  if (form.value.specie == "other") {
    return otherSpecie.value ?? "";
  }
  return form.value.specie ?? "";
});

const creating = ref(false);
const speciesOptions = ["Cat", "Dog", "Bird", "Other"];

const onSubmit = async () => {
  creating.value = true;
  try {
    await props.handleSubmit({
      name: form.value.name,
      specie: selectedSpecie.value,
      metadata: form.value.metadata,
      // other fields...
    });
    // Reset form after successful submission
    form.value = {
      name: "",
      specie: "",
      metadata: {},
      // Reset other fields...
    };
  } catch (error) {
    console.error("Error creating pet:", error);
  } finally {
    creating.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="p-fluid">
    <div class="field">
      <label for="name">Name</label>
      <InputText id="name" v-model="form.name" required />
    </div>

    <div class="flex column pad-5">
      <label class="pad-5" for="selectedSpecie">Specie</label>
      <!-- <div class="row"> -->
      <Select
        :options="speciesOptions"
        class="w-300px"
        id="selectedSpecie"
        name="selectedSpecie"
        placeholder="Select your pet specie"
        v-model="form.specie"
        required
      />
      <FloatLabel
        variant="in"
        v-if="form.specie.toLowerCase() == 'other'"
        :required="form.specie.toLowerCase() == 'other'"
      >
        <label for="specieName">Specie</label>
        <InputText
          id="specieName"
          name="specieName"
          class="w-200px"
          v-model="otherSpecie"
        />
      </FloatLabel>
      <!-- </div> -->
    </div>

    <!-- Other fields -->

    <div class="field">
      <MetadataEditor v-model="form.metadata" />
    </div>

    <div class="flex justify-content-end gap-2">
      <Button
        v-if="props.handleCancel"
        type="button"
        label="Cancel"
        severity="secondary"
        @click="props.handleCancel"
      />
      <Button type="submit" label="Create" :loading="creating" />
    </div>
  </form>
</template>
