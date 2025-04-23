<script setup lang="ts">
import Layout from "../../layouts/staff.vue";
import ReservationListItem from "../../components/ReservationListItem.vue";
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useReservationsStore } from "../../stores/reservations";
import { storeToRefs } from "pinia";
import CreateReservationDialog from "@components/dialog/CreateReservationDialog.vue";
import { useStaffStore } from "@stores/staff";

const toast = useToast();

const showNewReservationDialog = ref(false);

const store = useReservationsStore();
const { refresh: getStaffMembers } = useStaffStore();
const { staffMembers } = storeToRefs(useStaffStore());

const { reservations: reservationsRef } = storeToRefs(store);
const { refresh: fetchReservations } = store;

// Filter refs
const selectedDate = ref(null);
const selectedTimeSlots = ref<string[]>([]);
const selectedCustomerName = ref("");
const selectedStatuses = ref<string[]>([]);
const selectedAssignees = ref<number[]>([]);

// Computed properties for filter options
const timeSlotOptions = computed(() => {
  if (!reservationsRef.value) return [];
  const uniqueTimeSlots = [
    ...new Set(
      reservationsRef.value.map(
        (record) =>
          `${record.reservation.time.from}-${record.reservation.time.to}`,
      ),
    ),
  ];

  return uniqueTimeSlots.map((slot) => {
    const [from, to] = slot.split("-");
    return {
      name: `${from} - ${to}`,
      value: slot,
    };
  });
});

const statusOptions = computed(() => {
  if (!reservationsRef.value) return [];
  const uniqueStatuses = [
    ...new Set(
      reservationsRef.value.map((record) => record.reservation.status),
    ),
  ];

  return uniqueStatuses.map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: status,
  }));
});

const assigneesOptions = computed(() => {
  if (!reservationsRef.value) return [];
  const possiblelStaff = staffMembers.value.filter((staff) => {
    return (
      reservationsRef.value?.some((res) => res.assignee?.id == staff.userId) &&
      staff.user
    );
  });

  return [
    ...possiblelStaff.map((staff) => {
      console.log(staff);
      return {
        label: `${staff.user?.name} (${staff.user?.email})`,
        value: staff.userId,
      };
    }),
    { label: "Unassigned", value: undefined },
  ];
});

// Filtered reservations
const filteredReservations = computed(() => {
  if (!reservationsRef.value) return [];

  return reservationsRef.value.filter((record) => {
    // Date filter
    if (selectedDate.value) {
      const filterDate = new Date(selectedDate.value);
      const recordDate = new Date(
        record.reservation.date.year,
        record.reservation.date.month - 1,
        record.reservation.date.day,
      );

      if (
        filterDate.getDate() !== recordDate.getDate() ||
        filterDate.getMonth() !== recordDate.getMonth() ||
        filterDate.getFullYear() !== recordDate.getFullYear()
      ) {
        return false;
      }
    }

    // Time slot filter
    if (selectedTimeSlots.value.length > 0) {
      const recordTimeSlot = `${record.reservation.time.from}-${record.reservation.time.to}`;
      if (!selectedTimeSlots.value.includes(recordTimeSlot)) {
        return false;
      }
    }

    // Customer name filter
    if (selectedCustomerName.value.trim() !== "") {
      const fullName =
        `${record.user.name} ${record.user.surname}`.toLowerCase();
      if (!fullName.includes(selectedCustomerName.value.toLowerCase())) {
        return false;
      }
    }

    // Status filter
    if (selectedStatuses.value.length > 0) {
      if (!selectedStatuses.value.includes(record.reservation.status)) {
        return false;
      }
    }

    // Assgnee Filter
    if (selectedAssignees.value.length > 0) {
      if (!selectedAssignees.value.includes(record.reservation.assigneeId)) {
        return false;
      }
    }
    return true;
  });
});

// Clear all filters
const clearFilters = () => {
  selectedDate.value = null;
  selectedTimeSlots.value = [];
  selectedCustomerName.value = "";
  selectedStatuses.value = [];
  selectedAssignees.value = [];
};
onMounted(() => {
  getStaffMembers();
});
</script>
<template>
  <div class="__main">
    <Layout>
      <h1>Reservations Records</h1>
      <div>
        <Toolbar>
          <template #start>
            <Button
              icon="pi pi-plus"
              label="New"
              class="mr-2"
              severity="secondary"
              @click="showNewReservationDialog = true"
              text
            />
            <Button
              icon="pi pi-refresh"
              class="mr-2"
              severity="secondary"
              @click="fetchReservations()"
              text
            />
          </template>
        </Toolbar>

        <!-- Filters Panel -->
        <div class="filters-panel p-3 mb-3 surface-card border-round">
          <div class="row">
            <div class="col-12 md:col-3">
              <label class="block mb-1 font-medium">Date</label>
              <Calendar
                v-model="selectedDate"
                dateFormat="dd/mm/yy"
                placeholder="Select Date"
                class="w-full"
              />
            </div>
            <div class="col-12 md:col-3">
              <label class="block mb-1 font-medium">Time Slot</label>
              <MultiSelect
                v-model="selectedTimeSlots"
                :options="timeSlotOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select Time Slots"
                class="w-full"
                display="chip"
              />
            </div>
            <div class="col-12 md:col-3">
              <label class="block mb-1 font-medium">Customer Name</label>
              <InputText
                v-model="selectedCustomerName"
                placeholder="Search by name"
                class="w-full"
              />
            </div>
            <div class="col-12 md:col-3">
              <label class="block mb-1 font-medium">Assignees</label>
              <MultiSelect
                v-model="selectedAssignees"
                :options="assigneesOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Statuses"
                class="w-full"
                display="chip"
              />
            </div>
            <div class="col-12 md:col-3">
              <label class="block mb-1 font-medium">Status</label>
              <MultiSelect
                v-model="selectedStatuses"
                :options="statusOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Select Statuses"
                class="w-full"
                display="chip"
              />
            </div>
            <div class="col-12 flex justify-content-end">
              <Button
                icon="pi pi-filter-slash"
                label="Clear Filters"
                severity="secondary"
                text
                @click="clearFilters"
              />
            </div>
          </div>
        </div>

        <div>
          <Dialog
            v-model:visible="showNewReservationDialog"
            modal
            header="New Reservation"
            :style="{ width: '40rem' }"
          >
            <CreateReservationDialog
              :close="
                () => {
                  showNewReservationDialog = false;
                }
              "
            />
          </Dialog>
          <DataView
            :value="filteredReservations"
            paginator
            :rows="5"
            data-key="id"
            paginatorPosition="top"
          >
            <template #list="list">
              <div
                v-for="(item, index) in list.items"
                class="pad-y-10"
                :key="index"
              >
                <!-- @ts-ignore -->
                <ReservationListItem
                  :item="item"
                  :handleUpdate="
                    async (values: any) => {
                      await store
                        .update(item.reservation.id, values, (error) => {
                          toast.add({
                            severity: 'danger',
                            life: 5000,
                            summary: `Reservation update error : ${error.message}`,
                          });
                        })
                        .then(({ error }) => {
                          if (!error) {
                            toast.add({
                              severity: 'success',
                              life: 5000,
                              summary: 'Done !',
                            });
                          }
                        });
                    }
                  "
                />
              </div>
            </template>
            <template #empty>
              <div class="p-4 text-center">
                No reservations found matching the filter criteria.
              </div>
            </template>
          </DataView>
        </div>
      </div>
    </Layout>
  </div>
</template>
<style scoped>
.__main {
  height: 100%;
}
</style>
