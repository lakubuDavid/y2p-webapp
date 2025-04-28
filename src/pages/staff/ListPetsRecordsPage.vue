<script setup lang="ts">
import Layout from "../../layouts/staff.vue";
import { ref, computed } from "vue";
import { usePetsStore } from "../../stores/pets";
import ShowPetDialog from "../../components/dialog/ShowPetDialog.vue";
import EditPetDialog from "../../components/dialog/EditPetDialog.vue";
import { useToast } from "primevue/usetoast";
import type { UpdatePetParams } from "@lib/schemas";
import type { PetData } from "../../models/pet";

const toast = useToast();
const store = usePetsStore();
const showNewPetDialog = ref(false);
const showPetInfoDialog = ref(false);
const showEditPetDialog = ref(false);
const selectedPet = ref<PetData>();

// Filter-related refs
const selectedPetNames = ref<string[]>([]);
const selectedOwnerNames = ref<string[]>([]);

// Computed properties for filter options
const petNameOptions = computed(() => {
  console.log(store.pets);
  // Get unique pet names
  const uniqueNames = [...new Set(store.pets.map((pet) => pet.name))];
  return uniqueNames.map((name) => ({ name: name, value: name }));
});

const ownerNameOptions = computed(() => {
  // Get unique owner names
  const uniqueOwners = [...new Set(store.pets.map((pet) => pet.owner.name))];
  return uniqueOwners.map((name) => ({ name: name, value: name }));
});

// Filtered pets based on selected filters
const filteredPets = computed(() => {
  if (
    selectedPetNames.value.length === 0 &&
    selectedOwnerNames.value.length === 0
  ) {
    return store.pets; // Return all pets if no filters applied
  }

  return store.pets.filter((pet) => {
    const matchesName =
      selectedPetNames.value.length === 0 ||
      selectedPetNames.value.includes(pet.name);
    const matchesOwner =
      selectedOwnerNames.value.length === 0 ||
      selectedOwnerNames.value.includes(pet.owner.name);
    return matchesName && matchesOwner;
  });
});

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

// Clear all filters
const clearFilters = () => {
  selectedPetNames.value = [];
  selectedOwnerNames.value = [];
};
store.refresh();
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
              @click="() => (showNewPetDialog = true)"
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

        <!-- Filters Panel -->
        <div class="filters-panel p-3 mb-3 surface-card border-round">
          <div class="flex flex-column md:flex-row gap-3">
            <div class="flex-1">
              <label class="block mb-1 font-medium">Pet Names</label>
              <MultiSelect
                v-model="selectedPetNames"
                :options="petNameOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select Pet Names"
                class="w-full"
                display="chip"
              />
            </div>
            <div class="flex-1">
              <label class="block mb-1 font-medium">Owner Names</label>
              <MultiSelect
                v-model="selectedOwnerNames"
                :options="ownerNameOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select Owner Names"
                class="w-full"
                display="chip"
              />
            </div>
            <div class="flex align-items-end">
              <Button
                icon="pi pi-filter-slash"
                label="Clear Filters"
                severity="secondary"
                text
                @click="clearFilters"
              />
            </div>
          </div>
        </div>

        <div>
          <Dialog
            v-model:visible="showNewPetDialog"
            modal
            header="New Pet"
            :style="{ width: '60rem' }"
          >
            <NewPetDialog />
          </Dialog>
          <Dialog
            v-model:visible="showPetInfoDialog"
            modal
            header="Pet Details"
            :style="{ width: '60rem' }"
          >
            <ShowPetDialog v-if="selectedPet" :item="selectedPet" />
          </Dialog>

          <Dialog
            v-model:visible="showEditPetDialog"
            modal
            header="Edit Pet"
            :style="{ width: '60rem' }"
          >
            <EditPetDialog
              v-if="selectedPet"
              :item="selectedPet"
              :handleSubmit="handleUpdatePet"
              :close="() => (showEditPetDialog = false)"
            />
          </Dialog>
          <DataView
            :value="filteredPets"
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
