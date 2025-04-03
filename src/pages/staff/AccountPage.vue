<script setup lang="ts">
import { watch } from "vue";
import Layout from "../../layouts/staff.vue";
// import type { ApiResponse, UserData } from "../../../lib/types";
// import { api } from "../../../lib/client";
import { useToast } from "primevue/usetoast";
// import { useAuth } from "../../states/auth";
import { useAccountsStore } from "../../stores/accounts";
import { storeToRefs } from "pinia";
//import { api } from "../../../lib/client";

const toast = useToast();
//const auth = useAuth();
//const fetchUsers = async () => {
//  const { data, ok } = await api.get("/user", {
//    withCredentials: true,
//    headers: { ...auth.getAuthHeader() },
//  });
//  if (ok) {
//    const { data: rData, error } = data as ApiResponse<UserData[]>;
//    if (error) {
//      toast.add({ severity: "error", summary: error });
//    } else {
//      accountsRef.value = rData;
//    }
//  }
//};
//const accountsRef = ref([] as UserData[]);

const store = useAccountsStore();

//console.log(await api.get("/auth/me"));

const { accounts: accountsRef, error } = storeToRefs(store);
const { refresh: fetchAccounts } = store;
watch(error, (err) => {
  toast.add({ severity: "error", summary: err });
});

fetchAccounts();
</script>
<template>
  <div class="__main">
    <Layout>
      <h1>Users Records</h1>
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
            @click="fetchAccounts()"
            text
          />
          <!-- <IconField> -->
          <!-- <InputIcon> -->
          <!-- <i class="pi pi-search" /> -->
          <!-- </InputIcon> -->
          <!-- <InputText class="w-400" placeholder="Search" /> -->
          <!-- </IconField> -->
          <!-- <Button icon="pi pi-search" severity="secondary" text /> -->
        </template>
      </Toolbar>
      <!-- <div class="row"> -->
      <!-- <Button label="Create" /> -->
      <!-- <Button -->
      <!-- label="Refresh" -->
      <!-- icon="pi pi-refresh" -->
      <!-- iconPos="right" -->
      <!-- @click="() => fetchAccounts()" -->
      <!-- /> -->
      <!-- </div> -->
      <!-- <Divider /> -->
      <!-- @ts-ignore -->
      <DataView
        :value="/*@ts-ignore*/ accountsRef"
        paginator
        :rows="10"
        paginatorPosition="top"
      >
        <template #list="list">
          <div
            v-for="(item, index) in list.items"
            class="pad-y-10"
            :key="index"
          >
            <AccountListItem :item="item" />
          </div>
        </template>
      </DataView>
    </Layout>
  </div>
</template>
<style scoped>
.__main {
  height: 100%;
}
</style>
