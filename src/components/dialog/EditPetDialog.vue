<script lang="ts" setup>
import { ref } from "vue";
import type { PetData } from "../../../lib/types";
import type { UpdatePetParams } from "@lib/schemas";
import MetadataEditor from "@components/MetadataEditor.vue";
import { capitalized } from "@lib/utils";

const props = defineProps<{
  item: PetData;
  handleSubmit: (values: UpdatePetParams) => Promise<any>;
}>();

const form = ref({
  name: props.item.name || "",
  metadata: props.item.metadata || {},
  //breed: props.item.breed || "",
  //birthDate: props.item.birthDate || null,
  //notes: props.item.notes || ""
});

//const species = ["dog", "cat", "bird", "other"];

const onSubmit = async () => {
  const updateData: UpdatePetParams = {
    name: form.value.name,
    metadata: form.value.metadata,
    //breed: petInfo.value.breed,
    //birthDate: petInfo.value.birthDate,
    //notes: petInfo.value.notes
  };

  await props.handleSubmit(updateData);
};
</script>

<template>
  <Form @submit="onSubmit" class="column gap-15px">
    <Fieldset legend="Pet Information">
      <FloatLabel variant="in" class="form-group">
        <label for="name">Name</label>
        <InputText id="name" v-model="form.name" required class="w-200px" />
      </FloatLabel>
      <div class="form-group">
        <label for="specie">Species</label>
        {{ capitalized(item.specie) }}
      </div>
      <!-- <div class="form-group"> -->
      <!-- <label for="breed">Breed</label> -->
      <!-- <InputText id="breed" v-model="petInfo.breed" class="w-full" /> -->
      <!-- </div> -->
      <!-- <div class="form-group"> -->
      <!-- <label for="birthDate">Date of Birth</label> -->
      <!-- <Calendar -->
      <!-- id="birthDate" -->
      <!-- v-model="petInfo.birthDate" -->
      <!-- dateFormat="yy-mm-dd" -->
      <!-- class="w-full" -->
      <!-- /> -->
      <!-- </div> -->
    </Fieldset>

    <Fieldset legend="Medical Information">
      <!-- <div class="form-group"> -->
      <!-- <label for="notes">Medical Notes</label> -->
      <!-- <Textarea id="notes" v-model="petInfo.notes" rows="4" class="w-full" /> -->
      <!-- </div> -->
      <MetadataEditor v-model="form.metadata" />
    </Fieldset>

    <div class="flex justify-content-end">
      <Button
        type="submit"
        label="Save Changes"
        icon="pi pi-check"
        class="mr-2"
      />
      <Button
        type="button"
        label="Cancel"
        icon="pi pi-times"
        severity="secondary"
      />
    </div>
  </Form>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>
