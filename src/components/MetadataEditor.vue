<!-- /apps/webapp/src/components/MetadataEditor.vue -->
<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = defineProps<{
  modelValue: Record<string, any>; // JSON string
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void;
}>();

// Parsed metadata as an array of key-value pairs
const metadataItems = ref<{ key: string; value: string }[]>([]);
const newKey = ref("");
const newValue = ref("");

// Initialize metadata items from props
onMounted(() => {
  try {
    const metadata = props.modelValue;
    metadataItems.value = Object.entries(metadata).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  } catch (e) {
    console.error("Error parsing metadata:", e);
    metadataItems.value = [];
  }
});

// Update the model value when items change
watch(
  metadataItems,
  () => {
    const metadata = metadataItems.value.reduce(
      (acc, { key, value }) => {
        if (key.trim()) {
          acc[key.trim()] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    emit("update:modelValue", metadata);
  },
  { deep: true },
);

// Add a new metadata item
const addMetadataItem = () => {
  if (newKey.value.trim()) {
    // Check if key already exists
    const existingIndex = metadataItems.value.findIndex(
      (item) => item.key === newKey.value.trim(),
    );

    if (existingIndex >= 0) {
      // Update existing key
      metadataItems.value[existingIndex].value = newValue.value;
    } else {
      // Add new key-value pair
      metadataItems.value.push({
        key: newKey.value.trim(),
        value: newValue.value,
      });
    }

    // Clear input fields
    newKey.value = "";
    newValue.value = "";
  }
};

// Remove a metadata item
const removeMetadataItem = (index: number) => {
  metadataItems.value.splice(index, 1);
};
</script>

<template>
  <div class="metadata-editor">
    <h3 class="font-medium text-gray-700 mb-2">Additional Info</h3>

    <!-- Existing metadata items -->
    <div v-if="metadataItems.length > 0" class="mb-4">
      <div
        v-for="(item, index) in metadataItems"
        :key="index"
        class="flex gap-2 mb-2"
      >
        <InputText v-model="item.key" placeholder="Key" class="w-1/3" />
        <InputText v-model="item.value" placeholder="Value" class="w-1/2" />
        <Button
          icon="pi pi-trash"
          severity="danger"
          text
          @click="removeMetadataItem(index)"
          aria-label="Remove field"
        />
      </div>
    </div>

    <!-- Add new metadata item -->
    <div class="flex gap-2 mb-2">
      <InputText v-model="newKey" placeholder="Key" class="w-1/3" />
      <InputText v-model="newValue" placeholder="Value" class="w-1/2" />
      <Button
        icon="pi pi-plus"
        @click="addMetadataItem"
        :disabled="!newKey.trim()"
        aria-label="Add field"
      />
    </div>
  </div>
</template>
