<template>
        <div v-if="show" class="overflow-modal"></div>
        <Transition>
        <section  v-if="show">
        <div class="modal w-10/12 max-w-md ">
            <div class="modal-header">
            <h2>{{ header }}</h2>
            <font-awesome-icon icon="fas fa-xmark" class="w-6 modal-close"  @click="onClose" />
            </div>
            <div :class="!padding ? 'modal-content' : 'modal-content-bis'">
            <slot></slot>
            </div>
        </div>
        </section>
    </Transition>
  </template>
  
  <script setup>

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
      },
      header: {
        type: String,
        default: ""
      },
      padding: {
        type: Boolean,
        default: false
      }
})
const emit = defineEmits(['onClose'])

const onClose = () => emit("onClose")

</script>
  
  <style lang="scss" scoped>
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    position: relative;
    .modal {
      background-color: #3F3E3E;
      margin-bottom: 2rem;
      border: 2px solid rgba(4,192,168,0.7651654411764706);
      box-shadow: 0 0 0 0.2rem #3F3E3E;
      color: white;
      border-radius: 8px;
      padding: 15px;
      position: fixed;
      top: 50%;
      z-index: 9999;
      margin-top: 0rem; //-15rem;
      right: 0;
      left: 0;
      margin: 0 auto;
      &-header {
        display: flex;
        justify-content: space-between;
      }
      &-content{
        padding: 1rem 2.5rem 0rem 0.5rem;
        height: auto;
        &-bis{
          padding: 0;
        }
      }
      &-close {
        cursor: pointer;
        &:hover {
          color: grey;
          cursor: pointer;
        }
      }
    }
  }
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.overflow-modal{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1040;
    background-color: black;
    opacity: .5;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
  </style>
  