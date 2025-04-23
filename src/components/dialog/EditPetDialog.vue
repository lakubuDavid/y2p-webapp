<script lang="ts" setup>
import { ref } from "vue";
import type { PetData } from "../../models/pet";
import type { UpdatePetParams } from "@lib/schemas";
import MetadataEditor from "@components/MetadataEditor.vue";
import { capitalized } from "@lib/utils";
import { usePetsStore } from "@stores/pets";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

const props = defineProps<{
  item: PetData;
  handleSubmit: (values: UpdatePetParams) => Promise<any>;
  close: () => void;
}>();

const store = usePetsStore();
const toast = useToast();
const confirm = useConfirm();

const form = ref({
  name: props.item.name || "",
  metadata: props.item.metadata || {},
});

const onSubmit = async () => {
  const updateData: UpdatePetParams = {
    name: form.value.name,
    metadata: form.value.metadata,
  };

  await props.handleSubmit(updateData);
};
const deletePet = () => {
  confirm.require({
    modal: true,
    message: "Do you want to delete this record?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      store.delete(props.item.id).then(() => {
        toast.add({ severity: "success", summary: "Record deleted" });
        props.close();
      });
    },
  });
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
    </Fieldset>

    <Fieldset legend="Medical Information">
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
      <Spacer />
      <Button
        type="button"
        label="Delete"
        icon="pi pi-trash"
        severity="danger"
        @click="deletePet"
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
