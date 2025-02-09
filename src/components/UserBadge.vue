<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../states/auth";
import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";
import { useRouter } from "vue-router";

const auth = useAuth();
const { user } = auth.credentials.value;
const showDropdown = ref(false);

const router = useRouter();

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const signOutClick = async () => {
  await auth.signOut();
  //  router.push(router.currentRoute.value.path);
  router.go(0);
};
const loginClick = async () => {
  await router.push("/login");
};
const signUpClick = async () => {
  await router.push("/signUp");
};
</script>
<template>
  <div id="user-badge">
    <div class="trigger" @click="() => toggleDropdown()">
      <a>{{ user?.email ?? "Menu" }}</a>
    </div>
    <Dropdown :isShown="showDropdown">
      <template v-if="user">
        <DropdownItem>My Account</DropdownItem>
        <hr />
        <DropdownItem @click="() => signOutClick()">Sign Out</DropdownItem>
      </template>
      <template v-else>
        <DropdownItem @click="loginClick">Login</DropdownItem>
        <DropdownItem @click="signUpClick">Sign Up</DropdownItem>
      </template>
    </Dropdown>
  </div>
</template>
<style scoped>
#user-badge {
  position: absolute;
  right: 10px;
  top: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  .trigger {
    padding: 10px 20px;
    border-radius: 30px;
    background-color: #fed;
    border: 1px solid #0003;
    cursor: pointer;
  }
  hr {
    color: #fed;
    background: #fed;
  }
}
</style>
