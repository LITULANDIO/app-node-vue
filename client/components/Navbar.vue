<template>
  <nav>
    <div class="flex justify-between">
      <div @click="onGoHome" class="text-white flex items-center text-1xl">
        <span>{{ $t("navMenu.logo") }}</span
        ><span class="text-2xl ml-3 icon">🎭</span>
      </div>
      <div class="text-white flex items-center text-1xl mr-8">
        <span class="mr-3"
          >{{ $t("navMenu.welcome") }}
          <span class="text-1xl icon mr-1">👋</span> {{ authUser?.name }}</span
        >
        <font-awesome-icon
          @click="onLogout"
          icon="fa-solid fa-right-from-bracket"
          class="text-1xl cursor-pointer"
        />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuth } from "@/composables/useAuth";
import { useGuests } from "@/composables/useGuests";
import { useGroups } from "@/composables/useGroups";
import { useFriend } from "@/composables/useFriend";
const { user: authUser, logout } = useAuth();
const { setGuests } = useGuests();
const { setGroups, setGroupsUser, setCurrentGroup } = useGroups();
const { setFriend } = useFriend();

const onLogout = () => {
  setGuests([]);
  setGroups([]);
  setGroupsUser([]);
  setCurrentGroup({});
  setFriend({});
  logout();
};
const onGoHome = () => navigateTo("/dashboard/user");
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  margin-top: -5rem;
  padding: 1rem;
  width: 100%;
  background-color: #1c1e21;
  border-bottom: 1px solid rgba(84, 84, 84, 0.48);
  .icon {
    filter: sepia(1);
  }
}
</style>
