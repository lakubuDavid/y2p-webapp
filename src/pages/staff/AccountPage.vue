<script setup lang="ts">
import { ref, watch } from "vue";
import Layout from "../../layouts/staff.vue";
import { useToast } from "primevue/usetoast";
import { useAccountsStore } from "../../stores/accounts";
import { storeToRefs } from "pinia";
import type { CreateUserParams, UserData } from "../../models/user";

const toast = useToast();
const store = useAccountsStore();

const showNewAccountDialog = ref(false);
const showUserInfoDialog = ref(false);
const showEditUserDialog = ref(false);
const selectedUser = ref<Partial<UserData>>();
//console.log(await api.get("/auth/me"));

const { accounts: accountsRef, error } = storeToRefs(store);
const { refresh: fetchAccounts, create } = store;
watch(error, (err) => {
  toast.add({ severity: "error", summary: err });
});
/*@ts-ignore*/
const handleViewUser = (user: UserData) => {
  selectedUser.value = user;
  showUserInfoDialog.value = true;
};

/*@ts-ignore*/
const handleEditUser = (user: Partial<UserData>) => {
  selectedUser.value = user;
  showEditUserDialog.value = true;
};

/*@ts-ignore*/
const handleUpdateUser = async (values) => {
  /*@ts-ignore*/
  const userId = selectedUser.value?.id;
  //await update(userId, values, (error:Error) => {
  //  toast.add({
  //    severity: "error",
  //    summary: `Update error: ${error}`,
  //    life: 5000,
  //  });
  //}).then(({ error }) => {
  //  if (!error) {
  //    toast.add({
  //      severity: "success",
  //      summary: "User updated successfully",
  //      life: 3000,
  //    });
  //    showEditUserDialog.value = false;
  //    fetchAccounts();
  //  }
  //});
};

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
        <NewUserDialog
          :handleSubmit="(value: CreateUserParams) => create(value)"
        />
      </Dialog>
      <Dialog
        v-model:visible="showUserInfoDialog"
        modal
        header="User Details"
        :style="{ width: '40rem' }"
      >
        <ShowUserDialog v-if="selectedUser" :item="selectedUser" />
      </Dialog>

      <Dialog
        v-model:visible="showEditUserDialog"
        modal
        header="Edit User"
        :style="{ width: '40rem' }"
      >
        <EditUserDialog
          v-if="selectedUser"
          :item="selectedUser"
          :handleSubmit="handleUpdateUser"
        />
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
            <AccountListItem
              :item="item"
              @view="handleViewUser(item)"
              @edit="handleEditUser(item)"
            />
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
