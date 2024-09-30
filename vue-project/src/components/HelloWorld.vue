<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="heart-loading flex-ct-x">
    <ul style="--line-count: 9">
      <li v-for="v in 9" :key="v" :class="`line-${v}`" :style="`--line-index: ${v}`"></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.heart-loading {
  width: 200px;
  height: 200px;
  ul {
    display: flex;
    justify-content: space-between;
    width: 150px;
    height: 10px;
  }
  li {
    --Θ: calc(var(--line-index) / var(--line-count) * 0.5turn);
    --time: calc((var(--line-index) - 1) * 40ms);
    border-radius: 5px;
    width: 10px;
    height: 10px;
    background-color: #3c9;
    filter: hue-rotate(var(--Θ));
    animation-duration: 1s;
    animation-delay: var(--time);
    animation-iteration-count: infinite;
  }
  .line-1,
  .line-9 {
    animation-name: line-move-1;
  }
  .line-2,
  .line-8 {
    animation-name: line-move-2;
  }
  .line-3,
  .line-7 {
    animation-name: line-move-3;
  }
  .line-4,
  .line-6 {
    animation-name: line-move-4;
  }
  .line-5 {
    animation-name: line-move-5;
  }
}
</style>
