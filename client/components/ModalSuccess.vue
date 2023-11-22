<template>
 <Modal :show="showModal" @onClose="onCloseModal" padding>
        <div class="text-center">
            <font-awesome-icon icon="fa-solid fa-circle-info" class="icon text-teal-600 text-3xl mb-2" />
            <p class="mb-3">{{ text}}</p>
        </div>
      </Modal>
</template>

<script setup>
defineProps({
    showModal: {
        type: Boolean,
        default: false
    },
    text: {
        type: String
    }
})
defineEmits(["onCloseModal"])

</script>

<style lang="scss" scoped>

</style>