<template>
  <div v-if="isShow" class="searching">
    <ul>
      <li class="error" v-if="users.length === 0">
        {{ $t("search.notExist") }}
      </li>
      <template v-for="user in users" :key="user.id">
        <li
          @click="onClicked($event, user.id)"
          class="flex container justify-start items-center"
        >
          <img :src="user.photo" width="40" height="40" class="color-image" />
          <div class="ml-3">{{ user.user }} {{ user.lastname }}</div>
        </li>
      </template>
    </ul>
  </div>
  <div v-if="isGuest" class="exist-guest">{{ $t("search.error") }}</div>
</template>

<script setup>
import { onUpdated } from "vue";
//# props
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  guest: {
    type: Object,
    required: true,
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
});
//#end

//# emits
const emit = defineEmits(["onClicked"]);
const onClicked = ($event, user) => emit("onClicked", $event, user);
//#

//# cycle life
onUpdated(() => {
  if (props.guest.name === "") {
    props.isShow = false;
  }
});
//#end
</script>

<style lang="scss" scoped>
.searching {
  background: #3f3e3e;
  max-height: 150px;
  overflow-y: scroll;
  border: 2px solid;
  border-radius: 0.5rem;
  padding: 0.1rem;
  width: 111%;
  margin-right: 2rem;
  @media (min-width: 720px) {
    width: 107%;
  }
  ul {
    li {
      background: #3f3e3e;
      color: white;
      border: 2px solid rgba(4, 192, 168, 0.7651654412);
      margin-bottom: 5px;
      padding: 6px;
      border-radius: 5px;
      width: 95%;
      //filter: sepia();
      cursor: pointer;
      position: relative;
      z-index: 10;
      @media (min-width: 412px) {
        width: 96%;
      }
      &:hover {
        opacity: 0.7;
        //background-color: grey;
        //filter: sepia();
      }
      img.color-image {
        position: relative;
        z-index: 11;
        border-radius: 50%;
        filter: none;
        max-height: 40px;
      }
    }
    li:last-child {
      margin-bottom: 0;
    }
    li.error {
      color: red;
    }
  }
}
.exist-guest {
  background: #3f3e3e;
  color: red;
  border: 2px solid rgba(4, 192, 168, 0.7651654412);
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 5px;
  //filter: sepia();
  cursor: pointer;
  position: relative;
  z-index: 10;
  width: 105%;
}
</style>
