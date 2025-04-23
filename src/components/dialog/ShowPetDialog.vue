<script lang="ts" setup>
import { computed, ref } from "vue";
import type { PetData, PetInfo } from "../../models/pet";
import { useVueToPrint } from "vue-to-print";
import { usePetsStore } from "@stores/pets";
import type { ReservationHistoryRow } from "../../models/reservation";
import { toDate } from "@lib/types";

const props = defineProps<{
  item: PetData;
}>();

const icon = computed(() => {
  if (props.item.specie.includes("dog")) return "dog";
  if (props.item.specie.includes("cat")) return "cat";
  if (props.item.specie.includes("bird")) return "kiwi-bird";
  return "paw";
});

const info = ref<PetInfo | undefined>();
const history = ref<ReservationHistoryRow[]>([]);

const store = usePetsStore();

const fetchInfo = async () => {
  info.value = await store.getById(props.item.id);
  store.getHistory(props.item.id).then((arr) => {
    history.value = arr ?? [];
  });
  console.log(info.value);
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const contentRef = ref();
//@ts-ignore
const { handlePrint } = useVueToPrint({
  content: contentRef,
  documentTitle: "AwesomeFileName",
});

fetchInfo();
</script>

<template>
  <div class="column gap-4px h-max-900px" ref="contentRef">
    <Fieldset legend="Owner Information">
      <div class="row">
        <strong class="w-150px">Name:</strong>
        <span> {{ info?.owner.name }}</span>
        <strong class="w-150px">Surname:</strong>
        <span> {{ info?.owner.surname ?? "-" }}</span>
      </div>
      <div class="row">
        <strong class="w-150px">Email :</strong>
        <span> {{ info?.owner.email == "" ? "-" : info?.owner.email }}</span>
      </div>
      <div class="row">
        <strong class="w-150px">PhoneNumber :</strong>
        <span> {{ info?.owner.phoneNumber ?? "None" }}</span>
      </div>
    </Fieldset>
    <Fieldset legend="Pet Information">
      <div class="flex flex-col gap-2">
        <div class="row">
          <strong class="w-200px">Name:</strong>
          <span>{{ item.name }}</span>
        </div>
        <div class="row">
          <strong class="w-200px">Species:</strong>
          <span>
            {{ capitalize(item.specie) }}
            <FaIcon :icon="`fa-${icon}`" />
          </span>
        </div>
      </div>
    </Fieldset>

    <Fieldset
      legend="Additional Information"
      v-if="Object.keys(item.metadata).length > 0"
    >
      <!-- <div class="flex flex-direction-column gap-2"> -->
      <!-- <div class="row"> -->
      <!-- <strong class="w-200px">Notes:</strong> -->
      <!-- </div> -->
      <!-- <div> -->
      <!-- <p>{{ item.notes }}</p> -->
      <!-- </div> -->
      <!-- </div> -->
      <div class="row" v-for="(value, key) in item.metadata">
        <strong class="w-200px">{{ capitalize(key) }} :</strong>
        <span>{{ value }}</span>
      </div>
    </Fieldset>
    <Fieldset legend="History ">
      <DataTable :value="history" row="5"
        ><template #empty> No reservations found. </template>
        <template #loading> Loading reservations data. Please wait. </template>
        <Column field="reservationNumber" header="Number"></Column>
        <Column field="date" sortable header="Date">
          <template #body="slotProps">
            <span
              >{{ toDate(slotProps.data.date).toLocaleDateString("fr-Fr") }}
            </span>
          </template>
        </Column>
        <Column field="time" sortable header="Time">
          <template #body="slotProps">
            <span
              >{{ slotProps.data.time.from }} -
              {{ slotProps.data.time.to }}</span
            >
          </template>
        </Column>
        <Column field="status" sortable header="Status"></Column>
      </DataTable>
    </Fieldset>
    <img src="/logo.png" class="w-100px" />
  </div>
  <div class="row">
    <Spacer />
    <Button icon="pi pi-print" @click="handlePrint()" text />
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  padding: 8px 0;
}
</style>
