<template>
  <div class="container-icon" @click="onViewInfo">
    <font-awesome-icon icon="fas fa-info" />
  </div>
  <Modal header="Info" :show="showInfo" @onClose="onClose">
    <p>
      <font-awesome-icon icon="fa-solid fa-calendar" class="icon text-1xl" />
      <span class="pl-2">{{ changeFormatDate(group.date) }}</span>
    </p>
    <p class="my-4">
      <font-awesome-icon
        icon="fa-solid fa-location-dot"
        class="icon text-1xl"
      />
      <span class="pl-2 py-3">{{ group.location }}</span>
      <template v-if="group.id === 235">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2991.171337772286!2d2.1847932767863587!3d41.435503771293845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4bd00083afe8f%3A0x337e31d71bc71953!2sArami.bcn!5e0!3m2!1sca!2ses!4v1732112817482!5m2!1sca!2ses"
          width="100%"
          height="250"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </template>
    </p>
    <p>
      <font-awesome-icon icon="fa-solid fa-sack-dollar" class="icon text-1xl" />
      <span class="pl-2">{{ group.budget }}€</span>
    </p>
  </Modal>
</template>

<script setup>
import { ref } from "vue";
import { useGroups } from "@/composables/useGroups";
const { group } = useGroups();

const showInfo = ref(false);

const onViewInfo = () => {
  showInfo.value = true;
};
const onClose = () => {
  showInfo.value = false;
};

//#methods
const changeFormatDate = (date) => {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();
  return `${day}/${month}/${year}`;
};
//
</script>

<style lang="scss" scoped>
.container-icon {
  background-color: #3f3e3e;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  padding: 0.5rem;
  right: 6rem;
  bottom: -2.5rem;
  border: 2px solid rgba(4, 192, 168, 0.7651654412);
  box-shadow: 0 0 0 0.2rem #3f3e3e;
  width: 25px;
  font-size: 20px;
  color: white;
  height: 25px;
}
</style>
