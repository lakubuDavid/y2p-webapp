<script setup lang="ts">
import { useRouter } from "vue-router";
import Layout from "../layouts/accessform.vue";
import { useAuth } from "../states/auth";

const form = defineModel("form", { default: { email: "", password: "" } });
const router = useRouter();
const submit = async (ev: Event) => {
  ev.preventDefault();
  const response = await useAuth().login(form.value.email, form.value.password);
  if (response?.status == "ok") await router.push("/");
  else alert(response?.message);
};
</script>
<template>
  <Layout name="Login">
    <div>
      <form @submit="submit">
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
          <button class="btn">Login</button>
        </div>
      </form>
      <RouterLink to="/signup">I dont have an account</RouterLink>
    </div>
  </Layout>
</template>
