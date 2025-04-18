<script setup lang="ts">
import Layout from "../../layouts/staff.vue";
import { ref } from "vue";
import { usePetsStore } from "../../stores/pets";
import ShowPetDialog from "../../components/dialog/ShowPetDialog.vue";
import EditPetDialog from "../../components/dialog/EditPetDialog.vue";
import { useToast } from "primevue/usetoast";
import type { PetData } from "@lib/types";
import type { UpdatePetParams } from "@lib/schemas";

const toast = useToast();
const store = usePetsStore();
const showNewPetDialog = ref(false);
const showPetInfoDialog = ref(false);
const showEditPetDialog = ref(false);
const selectedPet = ref<PetData>();

const handleViewPet = (pet: PetData) => {
  selectedPet.value = pet;
  showPetInfoDialog.value = true;
};

const handleEditPet = (pet: PetData) => {
  selectedPet.value = pet;
  showEditPetDialog.value = true;
};

const handleUpdatePet = async (values: UpdatePetParams) => {
  const petId = selectedPet.value?.id;
  console.log("values", values);
  await store
    .update(petId!, values, (error: Error) => {
      toast.add({
        severity: "error",
        summary: `Update error: ${error}`,
        life: 5000,
      });
    })
    .then(({ error }) => {
      if (!error) {
        toast.add({
          severity: "success",
          summary: "Pet updated successfully",
          life: 3000,
        });
        showEditPetDialog.value = false;
        store.refresh();
      }
    });
};
</script>
<template>
  <div class="__main">
    <Layout>
      <h1>Pets Records</h1>
      <div>
        <Toolbar>
          <template #start>
            <Button
              icon="pi pi-plus"
              label="New"
              class="mr-2"
              severity="secondary"
              text
            />
            <Button
              icon="pi pi-refresh"
              class="mr-2"
              severity="secondary"
              @click="store.refresh()"
              text
            />
          </template>
        </Toolbar>
        <div>
          <Dialog
            v-model:visible="showNewPetDialog"
            modal
            header="New Pet"
            :style="{ width: '40rem' }"
          >
          </Dialog>
          <Dialog
            v-model:visible="showPetInfoDialog"
            modal
            header="Pet Details"
            :style="{ width: '40rem' }"
          >
            <ShowPetDialog v-if="selectedPet" :item="selectedPet" />
          </Dialog>

          <Dialog
            v-model:visible="showEditPetDialog"
            modal
            header="Edit Pet"
            :style="{ width: '40rem' }"
          >
            <EditPetDialog
              v-if="selectedPet"
              :item="selectedPet"
              :handleSubmit="handleUpdatePet"
            />
          </Dialog>
          <DataView
            :value="store.pets"
            data-key="id"
            paginator
            :rows="5"
            paginatorPosition="top"
          >
            <template #list="list">
              <div
                v-for="item in list.items"
                class="pad-y-10px column gap-10px"
                :key="item.id"
              >
                <div class="row">
                  <div class="column flex-grow gap-10px">
                    <div class="row">
                      <strong>Name</strong> : {{ item.name }}
                      <strong>Owner</strong> : {{ item.owner.name }}
                    </div>
                    <div class="row">
                      <strong>Specie</strong> : {{ item.specie }}
                    </div>
                    <div class="row">
                      <strong>Recorded At</strong>
                      {{ `${new Date(item.createdAt).toLocaleString()}` }}
                    </div>
                  </div>
                  <div class="row">
                    <Button
                      icon="pi pi-eye"
                      text
                      @click="handleViewPet(item)"
                    />
                    <Button
                      icon="pi pi-pencil"
                      text
                      @click="handleEditPet(item)"
                    />
                  </div>
                </div>
                <Divider />
              </div>
            </template>
          </DataView>
        </div>
      </div>
    </Layout>
  </div>
</template>
<style scoped>
.__main {
  height: 100%;
}
</style>
