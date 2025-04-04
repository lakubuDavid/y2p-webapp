<script setup lang="ts">
import { ref, watch } from "vue";
import Layout from "../../layouts/staff.vue";
// import type { ApiResponse, UserData } from "../../../lib/types";
// import { api } from "../../../lib/client";
import { useToast } from "primevue/usetoast";
// import { useAuth } from "../../states/auth";
import { useAccountsStore } from "../../stores/accounts";
import { storeToRefs } from "pinia";
//import { api } from "../../../lib/client";

const toast = useToast();
const store = useAccountsStore();

const showNewAccountDialog = ref(false);

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
            @click="showNewAccountDialog = true"
          />
          <Button
            icon="pi pi-refresh"
            class="mr-2"
            severity="secondary"
            @click="fetchAccounts()"
            text
          />
        </template>
      </Toolbar>
      <Dialog
        v-model:visible="showNewAccountDialog"
        modal
        header="Create account"
        :style="{ width: '40rem' }"
      >
        <NewUserDialog />
      </Dialog>
      <DataView
        :value="accountsRef"
        data-key="id"
        paginator
        :rows="5"
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
