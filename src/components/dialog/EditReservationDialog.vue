<script lang="ts" setup>
import { useConfirm } from "primevue/useconfirm";
import { computed, ref } from "vue";
import { toDate, toReservationDate, type TimeSlot } from "../../../lib/types";
import { AvailableTimeSlots } from "../../constants";
import { useReservationsStore } from "@stores/reservations";
import { useToast } from "primevue/usetoast";
import type { Reservation, ReservationRecord } from "../../models/reservation";
import { useStaffStore, type StaffData } from "@stores/staff";
import { storeToRefs } from "pinia";

const { refresh: getStaffMembers } = useStaffStore();
const { staffMembers } = storeToRefs(useStaffStore());
const props = defineProps<{
  item: ReservationRecord;
  handleSubmit: <T>(values: Partial<Reservation>) => Promise<T>;
  close: () => void;
}>();
const icon = computed(() => {
  if (props.item.pet.specie.includes("dog")) return "dog";
  if (props.item.pet.specie.includes("cat")) return "cat";
  if (props.item.pet.specie.includes("bird")) return "kiwi-bird";
  return "paw";
});
const selectedDateRef = ref(toDate(props.item.reservation.date));
const selectedTime = ref<TimeSlot>(props.item.reservation.time);
const availableTimeSlots = ref<TimeSlot[]>(AvailableTimeSlots as TimeSlot[]);
const timeSlotsOptions = computed(() => {
  return availableTimeSlots.value.map((slot: TimeSlot) => {
    return { label: `${slot.from} - ${slot.to}`, value: slot };
  });
});

const availableAssignee = ref<StaffData[]>(staffMembers.value);
const availableAssigneeOptions = computed(() => {
  return availableAssignee.value
    .filter((v) => v.role == "veterinary")
    .map((v) => {
      return {
        label: `${v.user?.name} (${v.user?.email})`,
        value: v.userId,
      };
    });
});
const selectedAssignee = ref<number>(props.item.reservation.assigneeId);

const store = useReservationsStore();
const confirm = useConfirm();
const toast = useToast();

const getAvailableSlots = async () => {
  availableTimeSlots.value = [
    ...((await store.getAvailableSlots(selectedDateRef.value)) || []),
    selectedTime.value,
  ];
};

const updateReservation = async () => {
  console.log({
    selectedDate: selectedDateRef.value,
    selectedTime: selectedTime.value,
  });
  store
    .update(props.item.reservation.id, {
      date: toReservationDate(selectedDateRef.value),
      time: selectedTime.value as TimeSlot,
      assigneeId: selectedAssignee.value,
    })
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Record updated",
      });
      props.close();
    });
};
const markAsDone = async (value: boolean) => {
  console.log({
    selectedDate: selectedDateRef.value,
    selectedTime: selectedTime.value,
  });
  store
    .update(props.item.reservation.id, {
      status: value ? "done" : "oncoming",
    })
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Record updated",
      });
      props.close();
    });
};

const deleteReservation = () => {
  confirm.require({
    modal: true,
    message: "Do you want to delete this record?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      store.delete(props.item.reservation.id).then(() => {
        toast.add({ severity: "success", summary: "Record deleted" });
        props.close();
      });
    },
  });
};
const cancelReservation = () => {
  confirm.require({
    modal: true,
    message: "Do you want to cancel this reservation ?",
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      store
        .update(props.item.reservation.id, { status: "canceled" })
        .then(() => {
          toast.add({ severity: "success", summary: "Record deleted" });
          props.close();
        });
    },
  });
};
getAvailableSlots();
getStaffMembers();
</script>
<template>
  <div>
    <strong>Created at </strong>
    {{ new Date(item.reservation.createdAt).toLocaleDateString() }}
    <FieldSet legend="Client Info">
      <div class="row pad-5">
        <strong>Name</strong>
        <span class="w-200px">
          {{ `${item.user.name} ${item.user.surname}` }}
        </span>
      </div>
      <div class="row pad-5">
        <strong>Email</strong>
        <span class="w-200px">
          {{
            item.user.email
              ? item.user.email != ""
                ? item.user.email
                : "None"
              : "None"
          }}</span
        >
      </div>
      <div class="row pad-5">
        <strong>Phone</strong>
        <span class="w-200px">
          {{
            item.user.phoneNumber && item.user.phoneNumber.trim() != ""
              ? item.user.phoneNumber
              : "None"
          }}</span
        >
      </div>
    </FieldSet>
    <FieldSet legend="Pet Info">
      <div class="column pad-5">
        <strong>Pet Name</strong> <span> {{ item.pet.name }} </span>
        <br />
        <strong>Specie</strong>
        <span>
          {{ item.pet.specie }}
        </span>
      </div>
      <FaIcon :icon="`fa-${icon}`" />
    </FieldSet>

    <FieldSet legend="Reservation">
      <div class="row">
        <FloatLabel class="pad-5" variant="in">
          <label for="reservationDate">Date</label>
          <DatePicker
            id="reservationDate"
            name="reservationDate"
            class="w-150px"
            date-format="dd/mm/yy"
            :min-date="new Date()"
            v-model="selectedDateRef"
            @value-change="() => getAvailableSlots()"
            required
          />
        </FloatLabel>
      </div>
      <div class="pad-5 row">
        <label class="pad-5" for="selectedTime">Time</label>
        <!-- <div class="row"> -->
        <Select
          :options="timeSlotsOptions"
          class="w-300px"
          id="selectedTime"
          name="selectedTime"
          placeholder="Select a time slot"
          optionLabel="label"
          optionValue="value"
          v-model="selectedTime"
          required
        />
      </div>
      <div class="pad-5 row">
        <label class="pad-5" for="assignee">Assignee </label>
        <!-- <div class="row"> -->
        <Select
          :options="availableAssigneeOptions"
          class="w-300px"
          id="assignee"
          name="assignee"
          placeholder="Select an assignee"
          optionLabel="label"
          optionValue="value"
          v-model="selectedAssignee"
          required
        />
      </div>
    </FieldSet>
    <div class="row pad-10">
      <Button
        severity="contrast"
        icon="pi pi-save"
        iconPos="right"
        text
        @click="updateReservation()"
      />

      <span class="row justify-center items-center">
        <label for="is-done">Is Done</label>
        <ToggleSwitch
          id="is-done"
          v-on:value-change="(ev) => markAsDone(ev)"
          :defaultValue="item.reservation.status == 'done'"
        />
      </span>
      <Spacer fill="true" />
      <Button
        label="Cancel"
        severity="danger"
        text
        @click="cancelReservation()"
      />
      <Button
        label="Delete"
        severity="danger"
        icon="pi pi-trash"
        iconPos="right"
        @click="deleteReservation()"
      />
    </div>
  </div>
  <!-- <Button -->
  <!-- type="button" -->
  <!-- label="Close" -->
  <!-- severity="secondary" -->
  <!-- @click="showInfo = false" -->
  <!-- ></Button> -->
</template>
