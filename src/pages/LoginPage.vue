<script setup lang="ts">
import { useRouter } from "vue-router";
import Layout from "../layouts/accessform.vue";
import { useAuth } from "../states/auth";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const form = defineModel<{ email: string; password: string }>("form", {
  default: { email: "", password: "" },
});
const router = useRouter();
const submit = async (ev: Event) => {
  ev.preventDefault();
  const { error } = await useAuth().login(
    form.value?.email ?? "",
    form.value?.password ?? "",
  );
  if (error) {
    toast.add({ severity: "danger", summary: error });
  } else {
    await router.push("/");
  }
};
</script>
<template>
  <Layout name="Login">
    <div>
      <form @submit="submit">
        <div class="form-group">
          <label for="email" autocomplete> Email </label>
          <input type="email" name="email" id="i-email" v-model="form.email" />
        </div>
        <div class="form-group">
          <label for="password" autocomplete> Password </label>

          <input
            type="password"
            name="password"
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
