import { ref } from "vue";

export const unavailableDates = ref([
  {
    repeat: {
      weekdays: [7, 1],
    },
  },
  new Date(2025,0,16)
]);
