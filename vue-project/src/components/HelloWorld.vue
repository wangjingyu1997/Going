<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
const open = () => {
  window.location.href = "zhihu://";
};
</script>

<template>
  <div class="open" @click="open"></div>
  <div>打开app</div>
</template>

<style scoped></style>
