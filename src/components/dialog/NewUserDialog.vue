<script setup lang="ts">
import type { CreateUserParams } from "@lib/types";
import { ref } from "vue";

defineProps<{
  handleSubmit: (data: CreateUserParams) => void | Promise<void>;
  handleCancel: () => void | Promise<void>;
}>();

const userInfo = ref({
  name: "",
  surname: "",
  email: "",
});
</script>
<template>
  <Form class="column gap-10">
    <div>
      <FieldSet legend="User Info" class="pad-15">
        <div class="row">
          <FloatLabel class="pad-5" variant="in">
            <InputText
              id="name"
              name="name"
              class="w-150px"
              v-model="userInfo.name"
              required
            />
            <label for="name">Name</label>
          </FloatLabel>
          <FloatLabel class="pad-5" variant="in">
            <InputText
              id="surname"
              name="surname"
              class="w-150px"
              v-model="userInfo.surname"
              required
            />
            <label for="surname">Surname</label>
          </FloatLabel>
        </div>
        <div class="column">
          <FloatLabel class="pad-5" variant="in">
            <label for="email">Email</label>
            <InputText
              name="email"
              id="email"
              class="w-300px"
              v-model="userInfo.email"
            />
          </FloatLabel>
        </div>
      </FieldSet>
      <Fieldset legend="Login access" class="pad-15"> </Fieldset>
    </div>
    <div class="row gap-10">
      <Button label="Submit" type="submit" />
      <Button label="Cancel" @click="handleCancel()" />
    </div>
  </Form>
</template>
<style scoped></style>
