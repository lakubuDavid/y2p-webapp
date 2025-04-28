<!-- src/pages/MyAccountPage.vue -->
<script setup lang="ts">
import Layout from "../layouts/default.vue";
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import type { ReservationRecord } from "../models/reservation";
import { useToast } from "primevue/usetoast";
import { useUserStore } from "../stores/user";
import { useReservationsStore } from "../stores/reservations";
import type { StaffUserData } from "../models/user";

const userStore = useUserStore();
const reservationsStore = useReservationsStore();
const toast = useToast();

const { currentUser } = storeToRefs(userStore);
const { reservations } = storeToRefs(reservationsStore);

const loading = ref(true);
const userReservations = ref<ReservationRecord[]>([]);

// Computed property to determine if user is staff
const isStaff = computed(() => currentUser.value?.type === "staff");

// Get user's reservations (for clients) or assigned reservations (for staff)
const fetchUserReservations = async () => {
  loading.value = true;
  try {
    await reservationsStore.refresh();

    if (reservations.value) {
      if (isStaff.value) {
        const user = currentUser.value as StaffUserData;
        // For staff, show assigned reservations
        userReservations.value = reservations.value.filter(
          (record) => record.reservation.assigneeId === user.staffId,
        );
      } else {
        // For clients, show their own reservations
        userReservations.value = reservations.value.filter(
          (record) => record.reservation.userId === currentUser.value?.id,
        );
      }
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to load reservations",
      life: 3000,
    });
    console.error("Error fetching reservations:", error);
  } finally {
    loading.value = false;
  }
};

// Format date for display
const formatDate = (date: any) => {
  if (!date) return "N/A";
  const { day, month, year } = date;
  return `${day}/${month}/${year}`;
};

// Get status label with proper formatting
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    oncoming: "Scheduled",
    done: "Completed",
    canceled: "Canceled",
    reschedueld: "Rescheduled", // Note: there's a typo in your original model
    late: "Missed",
  };
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

onMounted(() => {
  fetchUserReservations();
});
</script>

<template>
  <Layout>
    <div class="my-account-page p-4 min-h-800px">
      <h1 class="text-2xl font-bold mb-4">My Account</h1>

      <!-- User Information Section -->
      <div class="user-info p-4 mb-4 surface-card border-round shadow-2">
        <h2 class="text-xl font-bold mb-2">Personal Information</h2>
        <div v-if="currentUser" class="p-grid">
          <div class="p-col-12 p-md-6 mb-2">
            <strong>Name:</strong> {{ currentUser.name }}
            {{ currentUser.surname }}
          </div>
          <div class="p-col-12 p-md-6 mb-2">
            <strong>Email:</strong> {{ currentUser.email }}
          </div>
          <div class="p-col-12 p-md-6 mb-2" v-if="currentUser.phoneNumber">
            <strong>Phone:</strong> {{ currentUser.phoneNumber }}
          </div>
          <div class="p-col-12 p-md-6 mb-2">
            <strong>Account Type:</strong>
            {{
              currentUser.type.charAt(0).toUpperCase() +
              currentUser.type.slice(1)
            }}
          </div>
          <div
            class="p-col-12 p-md-6 mb-2"
            v-if="isStaff && 'role' in currentUser"
          >
            <strong>Role:</strong>
            {{
              currentUser.role.charAt(0).toUpperCase() +
              currentUser.role.slice(1)
            }}
          </div>
        </div>
      </div>

      <!-- Reservations Section -->
      <div class="reservations-section p-4 surface-card border-round shadow-2">
        <h2 class="text-xl font-bold mb-2">
          {{ isStaff ? "Assigned Reservations" : "Reservation History" }}
        </h2>

        <div v-if="loading" class="p-4 text-center">
          <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
          <div>Loading reservations...</div>
        </div>

        <div v-else-if="userReservations.length === 0" class="p-4 text-center">
          <i
            class="pi pi-calendar-times text-5xl text-color-secondary mb-3"
          ></i>
          <div class="text-lg">No reservations found</div>
        </div>

        <DataTable
          v-else
          :value="userReservations"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20]"
          stripedRows
          responsiveLayout="stack"
          breakpoint="960px"
        >
          <Column
            field="reservation.reservationNumber"
            header="Reservation Number"
          ></Column>
          <Column header="Date">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.reservation.date) }}
            </template>
          </Column>
          <Column header="Time">
            <template #body="slotProps">
              {{ slotProps.data.reservation.time.from }} -
              {{ slotProps.data.reservation.time.to }}
            </template>
          </Column>
          <Column header="Pet">
            <template #body="slotProps">
              {{ slotProps.data.pet.name }} ({{ slotProps.data.pet.specie }})
            </template>
          </Column>
          <Column header="Status">
            <template #body="slotProps">
              <Tag
                :severity="getStatusSeverity(slotProps.data.reservation.status)"
              >
                {{ getStatusLabel(slotProps.data.reservation.status) }}
              </Tag>
            </template>
          </Column>
          <Column v-if="isStaff" header="Client">
            <template #body="slotProps">
              {{ slotProps.data.user.name }} {{ slotProps.data.user.surname }}
            </template>
          </Column>
        </DataTable>
      </div>

      <div class="mt-4">
        <Button
          label="Refresh"
          icon="pi pi-refresh"
          @click="fetchUserReservations"
          :loading="loading"
          class="p-button-secondary"
        />
      </div>
    </div>
  </Layout>
</template>

<script lang="ts">
// Helper function for status colors
function getStatusSeverity(status: string): string {
  switch (status) {
    case "oncoming":
      return "info";
    case "done":
      return "success";
    case "canceled":
      return "danger";
    case "reschedueld":
      return "warning";
    case "late":
      return "danger";
    default:
      return "secondary";
  }
}
</script>

<style scoped>
.my-account-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
