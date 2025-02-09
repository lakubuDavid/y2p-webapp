<script lang="ts" setup>
import { ref } from "vue";
import Layout from "../layouts/default.vue";
import { unavailableDates } from "../constants";
const dateRef = ref<Date>(new Date());

const calendarAttributes = ref({
  unavailableDates,
});
</script>
<template>
  <Layout>
    <div class="__sections">
      <div class="__section-2">
        <div>
          <form
            @submit="
              (e) => {
                e.preventDefault();
              }
            "
          >
            <div class="form-group">
              <label>Name</label>
              <input type="text" />
            </div>
            <div class="form-group">
              <label>Surname</label>
              <input type="text" />
            </div>
            <div class="form-group">
              <label>Email**</label>
              <input type="email" />
            </div>
            <div class="form-group">
              <label>Phone Number**</label>
              <input type="tel" />
            </div>
            <div class="form-group"></div>
            <div class="form-group">
              <label>Date</label>
              <span class="flex">
                <input type="text" readonly :value="dateRef.toLocaleString()" />
                <VDatePicker
                  v-model="dateRef"
                  :disabled-dates="calendarAttributes.unavailableDates"
                  color="yellow"
                  expanded
                  title-position="left"
                >
                  <template #default="{ togglePopover }">
                    <button
                      class="borderless transparent"
                      @click="togglePopover"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 17C16.1046 17 17 16.1046 17 15C17 13.8954 16.1046 13 15 13C13.8954 13 13 13.8954 13 15C13 16.1046 13.8954 17 15 17Z"
                          fill="currentColor"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM5 18V7H19V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </template>
                </VDatePicker>
              </span>
            </div>
            <div class="form-group">
              <label>Animal</label>
              <select>
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
                <option>Other</option>
              </select>
            </div>
            <div class="form-group">
              <button class="success">
                <span>Next</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0519 14.8285L13.4661 16.2427L17.7088 12L13.4661 7.7574L12.0519 9.17161L13.8804 11H6.34321V13H13.8803L12.0519 14.8285Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19.7782 19.7782C24.0739 15.4824 24.0739 8.51759 19.7782 4.22183C15.4824 -0.0739417 8.51759 -0.0739417 4.22183 4.22183C-0.0739417 8.51759 -0.0739417 15.4824 4.22183 19.7782C8.51759 24.0739 15.4824 24.0739 19.7782 19.7782ZM18.364 18.364C21.8787 14.8492 21.8787 9.15076 18.364 5.63604C14.8492 2.12132 9.15076 2.12132 5.63604 5.63604C2.12132 9.15076 2.12132 14.8492 5.63604 18.364C9.15076 21.8787 14.8492 21.8787 18.364 18.364Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="__section-1">
        <div></div>
      </div>
    </div>
  </Layout>
</template>
<style scoped>
.__sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
  > * {
    padding: 4rem;
    place-items: center;
    display: flex;
  }
  .__section-1 {
    border-left: 1px solid #0003;
  }
}
.simple-multi-example {
  &__meeting-selector {
    max-width: 542px;
  }
}
:deep(.loading-div) {
  top: 58px !important;
}
</style>
