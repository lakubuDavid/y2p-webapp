<script lang="ts" setup>
import { ref } from "vue";
import Layout from "../layouts/default.vue";
import BackButton from "../components/BackButton.vue";
import { AvailableTimeSlots, unavailableDates } from "../constants";
import ReservationSlots from "../components/ReservationSlots.vue";

import { toast, type ToastOptions } from "vue3-toastify";
import { api } from "../../lib/client";

const selectedDateRef = ref<Date>(new Date());
const selectedTime = ref<{ from: string; to: string }>();
const currentStep = ref(0);

const userInfo = ref({
  name: "",
  surname: "",
  email: "",
  phoneNumber: "",
});

const petInfo = ref({
  name: "",
  specie: "",
});

const calendarAttributes = ref({
  unavailableDates,
});

const backBtnClick = (ev: MouseEvent) => {
  ev.preventDefault();
  currentStep.value = 0;
};

const submitReservation = async () => {
  const selectedDateAndTime = new Date(selectedDateRef.value);
  const data = {
    userInfo: { ...userInfo.value },
    petInfo: {
      ...petInfo.value,
    },
    reservationInfo: {
      date: selectedDateRef.value,
      time: selectedTime.value,
    },
  };
  //1. Validate Input
  console.log(data);
  if (!selectedTime.value) {
    toast.error("Please select a reservation time");
    return;
  }
  if (selectedDateRef.value.getTime() < new Date().setHours(0)) {
    toast.error("Please select a vallid date");
    return;
  }
  //2. Format data
  //3. Send
  const response = await api.post("/reservation", data);
  if (response.ok) {
    toast.success("Reservation done!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  } else {
    toast.error(`Reservation error ${response.problem}`, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  }
  console.log(response.data);
};

const slots = AvailableTimeSlots;

const onTimeSlotSelected = (time: any) => {
  selectedTime.value = time;
};
</script>
<template>
  <Layout>
    <BackButton />
    <div class="__sections">
      <div class="__section-2">
        <div>
          <form
            @submit="
              (e) => {
                e.preventDefault();

                if (
                  userInfo.email.trim() == '' &&
                  userInfo.phoneNumber.trim() == ''
                ) {
                  toast.error('Either email or phone number must be provided', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  } as ToastOptions);
                  return;
                }
                if (!selectedDateRef) {
                  toast.error('Please select a valid date', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  } as ToastOptions);
                  return;
                }
                const today = new Date();
                if (
                  selectedDateRef.getUTCFullYear() < today.getUTCFullYear() ||
                  selectedDateRef.getUTCMonth() < today.getUTCMonth() ||
                  selectedDateRef.getUTCDate() < today.getUTCDate()
                ) {
                  toast.error('Please select a valid date');
                  return;
                }
                console.log(petInfo.specie);
                if (!petInfo.specie) {
                  toast.error('Animal specie not selected', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                  } as ToastOptions);
                  return;
                }

                currentStep = 1;
              }
            "
          >
            <h2>Contact Informattion</h2>
            <div class="form-group">
              <label>Name</label>
              <input
                type="text"
                v-model="userInfo.name"
                required
                :readonly="currentStep != 0"
              />
            </div>
            <div class="form-group">
              <label>Surname</label>
              <input
                type="text"
                v-model="userInfo.surname"
                required
                :readonly="currentStep != 0"
              />
            </div>
            <div class="form-group">
              <label>Email**</label>
              <input
                type="email"
                v-model="userInfo.email"
                :readonly="currentStep != 0"
              />
            </div>
            <div class="form-group">
              <label>Phone Number**</label>
              <input
                type="tel"
                v-model="userInfo.phoneNumber"
                :readonly="currentStep != 0"
              />
            </div>
            <div class="form-group"></div>
            <div class="form-group">
              <label>Date</label>
              <span class="flex">
                <!-- <input -->
                <!-- type="text" -->
                <!-- readonly -->
                <!-- :value="selectedDateRef.toLocaleDateString()" -->
                <!-- required -->
                <!-- /> -->
                <DatePicker
                  v-model="selectedDateRef"
                  :minDate="new Date()"
                  dateFormat="dd/mm/yy"
                  required
                />
                <!-- <VDatePicker -->
                <!-- v-model="selectedDateRef" -->
                <!-- :disabled-dates="calendarAttributes.unavailableDates" -->
                <!-- :min-date="new Date()" -->
                <!-- color="yellow" -->
                <!-- expanded -->
                <!-- title-position="left" -->
                <!-- > -->
                <!-- <template #default="{ togglePopover }"> -->
                <!-- <button -->
                <!-- class="borderless transparent" -->
                <!-- @click="() => currentStep == 0 && togglePopover()" -->
                <!-- > -->
                <!-- <svg -->
                <!-- width="24" -->
                <!-- height="24" -->
                <!-- viewBox="0 0 24 24" -->
                <!-- fill="none" -->
                <!-- xmlns="http://www.w3.org/2000/svg" -->
                <!-- > -->
                <!-- <path -->
                <!-- d="M15 17C16.1046 17 17 16.1046 17 15C17 13.8954 16.1046 13 15 13C13.8954 13 13 13.8954 13 15C13 16.1046 13.8954 17 15 17Z" -->
                <!-- fill="currentColor" -->
                <!-- /> -->
                <!-- <path -->
                <!-- fill-rule="evenodd" -->
                <!-- clip-rule="evenodd" -->
                <!-- d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM5 18V7H19V18C19 18.5523 18.5523 19 18 19H6C5.44772 19 5 18.5523 5 18Z" -->
                <!-- fill="currentColor" -->
                <!-- /> -->
                <!-- </svg> -->
                <!-- </button> -->
                <!-- </template> -->
                <!-- </VDatePicker> -->
              </span>
            </div>
            <h2>Pet Info</h2>
            <div class="form-group">
              <label>Name</label>
              <input type="text" v-model="petInfo.name" required />
            </div>
            <div class="form-group">
              <label>Animal</label>
              <select required v-model="petInfo.specie">
                <option disabled value>- Select the specie -</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-goup pad-5">
              <button class="btn" v-if="currentStep == 0">Next</button>
            </div>
          </form>
        </div>
      </div>
      <div class="__section-1" :class="currentStep == 1 ? '' : 'hidden'">
        <div>
          <form
            @submit="
              (e) => {
                e.preventDefault();
              }
            "
          >
            <ReservationSlots
              @selected-slot="onTimeSlotSelected"
              :slots="slots"
            />
            <div class="inline-form-group">
              <button
                @click="backBtnClick"
                v-show="currentStep == 1"
                :class="currentStep == 1 ? '' : 'invisible'"
              >
                <span>Back</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.9481 14.8285L10.5339 16.2427L6.29122 12L10.5339 7.7574L11.9481 9.17161L10.1196 11H17.6568V13H10.1196L11.9481 14.8285Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.22183 19.7782C-0.0739419 15.4824 -0.0739419 8.51759 4.22183 4.22183C8.51759 -0.0739419 15.4824 -0.0739419 19.7782 4.22183C24.0739 8.51759 24.0739 15.4824 19.7782 19.7782C15.4824 24.0739 8.51759 24.0739 4.22183 19.7782ZM5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="inline-form-group">
        <!-- <button -->
        <!-- @click="backBtnClick" -->
        <!-- v-show="currentStep == 1" -->
        <!-- :class="currentStep == 1 ? '' : 'invisible'" -->
        <!-- > -->
        <!-- <span>Back</span> -->
        <!-- <svg -->
        <!-- width="24" -->
        <!-- height="24" -->
        <!-- viewBox="0 0 24 24" -->
        <!-- fill="none" -->
        <!-- xmlns="http://www.w3.org/2000/svg" -->
        <!-- > -->
        <!-- <path -->
        <!-- d="M11.9481 14.8285L10.5339 16.2427L6.29122 12L10.5339 7.7574L11.9481 9.17161L10.1196 11H17.6568V13H10.1196L11.9481 14.8285Z" -->
        <!-- fill="currentColor" -->
        <!-- /> -->
        <!-- <path -->
        <!-- fill-rule="evenodd" -->
        <!-- clip-rule="evenodd" -->
        <!-- d="M4.22183 19.7782C-0.0739419 15.4824 -0.0739419 8.51759 4.22183 4.22183C8.51759 -0.0739419 15.4824 -0.0739419 19.7782 4.22183C24.0739 8.51759 24.0739 15.4824 19.7782 19.7782C15.4824 24.0739 8.51759 24.0739 4.22183 19.7782ZM5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364Z" -->
        <!-- fill="currentColor" -->
        <!-- /> -->
        <!-- </svg> -->
        <!-- </button> -->
        <button
          class="success"
          @click="(_) => submitReservation()"
          v-show="currentStep == 1"
        >
          <span>Confirm</span>
        </button>
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
    /*border-left: 1px solid #0003;*/
    &.hidden {
      opacity: 0;
    }
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
