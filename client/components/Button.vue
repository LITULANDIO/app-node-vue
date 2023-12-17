<template>
    <div class="button" @click="onClicked">
    <span v-if="label">{{ label }}</span>
    <slot></slot>
    </div>
</template>

<script setup>

//# props
const props = defineProps({
    label: {
        type: String,
        default: ''
      }
})
//#end

//# emits
const emit = defineEmits(['onClicked'])
const onClicked = () => emit("onClicked")
//#
</script>

<style lang="scss" scoped>
.button{
  cursor: pointer;
  position: realtive;
  //z-index: 999;
  bottom: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  //color: rgba(4, 192, 168, 0.7651654412);
  border: 2px solid rgba(4, 192, 168, 0.7651654412);
  color: white;
  background: #3F3E3E;
 // border: 2px solid yellow;
  box-shadow:0 0 0 0.2rem #3F3E3E;
  //filter:sepia()
  &:hover{
    opacity: 0.9;
  }
}
</style>