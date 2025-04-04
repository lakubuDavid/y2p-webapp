<script setup lang="ts">
import Layout from "../../layouts/staff.vue";
import { ref } from "vue";
import { usePetsStore } from "../../stores/pets";

const showNewPetDialog = ref(false);

const store = usePetsStore();
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
            header="New Reservation"
            :style="{ width: '40rem' }"
          >
          </Dialog>
          <DataView
            :value="store.pets"
            data-key="id"
            paginator
            :rows="5"
            paginatorPosition="top"
          >
            <template #list="list">
              <div v-for="item in list.items" class="pad-y-10" :key="item.id">
                <!-- <Card> -->
                <!-- <template #content> -->
                <div class="row">
                  <div class="col">Name : {{ item.name }}</div>
                  <div class="col">Owner : {{ item.owner.name }}</div>
                </div>
                <div class="row">
                  <div class="col">Specie : {{ item.specie }}</div>
                  <div class="col">
                    Recorded At:
                    {{ `${new Date(item.createdAt).toLocaleString()}` }}
                  </div>
                </div>
                <div class="row">
                  <Button icon="pi pi-eye" text />
                  <Button icon="pi pi-pencil" text />
                </div>
                <!-- </template> -->
                <!-- </Card> -->
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
