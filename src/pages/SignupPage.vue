<script setup lang="ts">
import { useRouter } from "vue-router";
import Layout from "../layouts/accessform.vue";
import { useAuth } from "../states/auth";

const form = defineModel("form", {
  default: { email: "", password: "", name: "", confirmPassword: "" },
});
const router = useRouter();
const submit = async (ev: Event) => {
  ev.preventDefault();
  if (form.value.password != form.value.confirmPassword) {
    alert("Passwords must match confirm");
    return;
  }
  if (
    form.value.name == "" ||
    form.value.email == "" ||
    form.value.password == ""
  ) {
    alert("Fill in all fields");
  }
  const response = await useAuth().signUp(
    form.value.name,
    form.value.email,
    form.value.password,
  );
  if (response?.status == "ok") await router.push("/");
  else {
    let errorMessage = response?.message ?? "";
    if (response?.error?.issues) {
      response.error.issues.forEach((err: any) => {
        errorMessage += `${err.message}, \n`;
      });
    }
    alert(`${errorMessage}`);
  }
};
</script>
<template>
  <Layout name="Signup">
    <div>
      <form @submit="submit">
        <div class="form-group">
          <label for="i-name"> Name </label>
          <input type="text" name="i-name" id="i-name" v-model="form.name" />
        </div>
        <div class="form-group">
          <label for="i-email"> Email </label>
          <input
            type="email"
            name="i-email"
            id="i-email"
            v-model="form.email"
          />
        </div>
        <div class="form-group">
          <label for="i-password"> Password </label>
          <input
            type="password"
            name="i-password"
            id="i-password"
            v-model="form.password"
          />
        </div>
        <div class="form-group">
          <label for="i-confirmPassword"> Confirm Password </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            name="i-confirmPassword"
            id="i-confirmPassword"
          />
        </div>
        <div class="form-group">
          <button class="btn">Sign Up</button>
        </div>
      </form>
      <RouterLink to="/login">I already have an account</RouterLink>
    </div>
  </Layout>
</template>
