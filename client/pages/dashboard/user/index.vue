<template>
  <Title>Dashboard {{ authUser.name }}</Title>
  <NuxtLayout />
  <ButtonConfig />
  <section class="flex justify-center items-center flex-col">
    <Groups :key="groups.length" @onClicked="onGoGroup" />
  </section>
  <div style="margin-top: 1rem">
    <Countdown />
  </div>
  <section id="modal">
    <ModalCreateGroup
      :isOpen="isOpenModalCreate"
      :dataUser="dataUser"
      :dataGroup="dataGroup"
      @onClose="onCloseModalCreate"
      @onSubmit="handleSubmit"
    />
    <ModalEntryGroup
      :isOpen="isOpenModalEntryGroup"
      :dataUser="dataUser"
      :error="errorEntryGroup"
      @onClose="onCloseModalEntry"
      @onSubmit="onGoGroupWithCode"
    />
  </section>
  <section class="flex justify-center items-center bottom-0 fixed w-full mb-3">
    <Button :label="$t('dashboard.buttonCreate')" @onClicked="onCreateGroup" />
    <!--<Button
      :label="$t('dashboard.buttonJoin')"
      @onClicked="onShowModalCodeGroup"
      class="ml-3"
    />-->
  </section>
</template>

<script setup>
import { reactive, onMounted, computed } from "vue";
import { DataProvider } from "@/data-provider/index";
import { useAuth } from "@/composables/useAuth";
import { useGroups } from "@/composables/useGroups";
import { useGuests } from "@/composables/useGuests";

definePageMeta({
  middleware: ["auth"],
});

//# const, ref, reactive
const { user: authUser } = useAuth();
const {
  group,
  groups,
  groupsUser,
  isLoading,
  addGroup,
  setCurrentGroup,
  getGroupsOfUser,
  setGroupsUser,
  getGroups,
} = useGroups();
const { guests } = useGuests(group.value.id);
const isOpenModalCreate = ref(false);
const isOpenModalEntryGroup = ref(false);
let dataGroup = reactive({
  id: 0,
  name: "",
  date: "",
  location: "",
  budget: "",
  admin: authUser.value.id,
  guests: 0,
});
const dataUser = reactive({
  user: "",
  password: "",
});
const errorEntryGroup = ref("");
//# end

//# computed
const unitGroup = computed(() => group.value);

//# end

//# events
const onCreateGroup = () => (isOpenModalCreate.value = true);
const onCloseModalCreate = () => (isOpenModalCreate.value = false);
const onCloseModalEntry = () => (isOpenModalEntryGroup.value = false);
const onShowModalCodeGroup = () => {
  isOpenModalEntryGroup.value = true;
  dataUser.user = authUser.value.name;
};
const handleSubmit = async () => {
  await addGroup({
    dataGroup,
    idUser: authUser.value.id,
  });
  isOpenModalCreate.value = false;
};
const onGoGroup = (groupSelceted) => {
  unitGroup.value.id = groupSelceted.id;
  unitGroup.value.admin = groupSelceted.admin;
  unitGroup.value.name = groupSelceted.name;
  unitGroup.value.date = groupSelceted.date;
  unitGroup.value.location = groupSelceted.location;
  unitGroup.value.budget = groupSelceted.budget;
  unitGroup.value.snug = groupSelceted.snug;
  setCurrentGroup(unitGroup.value);
  navigateTo(`/dashboard/user/group/${groupSelceted.snug}`);
};
const onGoGroupWithCode = async () => {
  errorEntryGroup.value = "";
  const fetchUser = await DataProvider({
    providerType: "GROUPS",
    type: "MATCH_CODE",
    params: dataUser,
  });
  if (fetchUser.body.error) {
    errorEntryGroup.value = fetchUser.body.msg;
    return;
  }
  const fetchGroup = await DataProvider({
    providerType: "GROUPS",
    type: "GET_GROUPS",
  });
  fetchGroup.body.forEach((grup) => {
    if (grup.snug === fetchUser.body.snug) {
      unitGroup.value.id = grup.id;
      unitGroup.value.admin = grup.admin;
      unitGroup.value.name = grup.name;
      unitGroup.value.date = grup.date;
      unitGroup.value.location = grup.location;
      unitGroup.value.budget = grup.budget;
      unitGroup.value.snug = grup.snug;
      setCurrentGroup(unitGroup.value);
    }
  });
  const _guests = await DataProvider({
    providerType: "GUESTS",
    type: "GET_GUESTS",
    params: fetchUser.body?.snug,
  });
  guests.value = _guests.body;
  navigateTo(`/dashboard/user/group/${fetchUser.body?.snug}`);
};
//# end

//# cycle life
onMounted(async () => {
  await getGroups(authUser.value.id);
  await getGroupsOfUser(authUser.value.id);
});
//# end
</script>

<style lang="scss" scoped>
#modal {
  position: absolute;
  width: 100%;
}
input[type="date"]::-webkit-inner-spin-button,
::-webkit-calendar-picker-indicator,
::-webkit-datetime-edit {
  display: none;
}

/* mostrar el calendario al hacer click */
input[type="date"]::-webkit-calendar-picker-indicator {
  display: block;
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
}

/* mostrar la fecha seleccionada al estar en hover */
input[type="date"]:hover::-webkit-datetime-edit {
  display: block;
}
</style>
