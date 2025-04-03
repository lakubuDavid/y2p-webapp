<template>
  <div class="spacer" :style="computedStyle"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  /** Space size in pixels or any valid CSS size value */
  size?: string | number;
  /** Used for vertical space when set to true */
  vertical?: boolean;
  /** Flex grow value (defaults to 1) */
  grow?: number;
  /** Flex shrink value (defaults to 0) */
  shrink?: number;
  /** Set to true to fill remaining space */
  fill?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 0,
  vertical: false,
  grow: 1,
  shrink: 0,
  fill: false,
});

const computedStyle = computed(() => {
  const styles: Record<string, string> = {
    flexGrow: props.fill ? "1" : props.grow.toString(),
    flexShrink: props.shrink.toString(),
  };

  if (props.size) {
    const sizeValue =
      typeof props.size === "number" ? `${props.size}px` : props.size;

    if (props.vertical) {
      styles.width = "100%";
      styles.height = sizeValue;
      styles.minHeight = sizeValue;
    } else {
      styles.height = "100%";
      styles.width = sizeValue;
      styles.minWidth = sizeValue;
    }
  }

  return styles;
});
</script>

<style scoped>
.spacer {
  display: block;
}
</style>
