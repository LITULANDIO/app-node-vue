import { ref, watch } from "vue";
import { DataProvider } from "@/data-provider/index";

export const useGroups = () => {
  const groupDefault = ref({
    id: "",
    admin: "",
    name: "",
    date: "",
    budget: "",
    location: "",
    snug: "",
  });

  const isLoading = ref(false);
  const group = ref(
    process.client
      ? JSON.parse(localStorage.getItem("group")) || groupDefault
      : groupDefault
  );
  const groups = ref(
    process.client ? JSON.parse(localStorage.getItem("groups")) || [] : []
  );
  const groupsUser = ref(
    process.client ? JSON.parse(localStorage.getItem("groups-user")) || [] : []
  );
  const allGroups = ref([]);

  watch(
    groups,
    async (newValue) => {
      localStorage.setItem("groups", JSON.stringify(newValue));
    },
    { deep: true }
  );

  watch(
    groupsUser,
    (newValue) => {
      localStorage.setItem("groups-user", JSON.stringify(newValue));
    },
    { deep: true }
  );

  watch(
    group,
    (newValue) => {
      if (process.client) {
        localStorage.setItem("group", JSON.stringify(newValue));
      }
    },
    { deep: true }
  );

  const setGroups = (newGroups) => {
    groups.value = newGroups;
  };

  const setGroupsUser = (newGroupsUser) => {
    groupsUser.value = newGroupsUser;
  };

  const getGroups = async (id) => {
    isLoading.value = true;
    try {
      const fetchGroup = await DataProvider({
        providerType: "GROUPS",
        type: "GET_GROUPS",
      });
      setGroups(fetchGroup.body.filter((group) => group.admin === id));
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const getAllGroups = async () => {
    isLoading.value = true;
    try {
      const fetchGroup = await DataProvider({
        providerType: "GROUPS",
        type: "GET_GROUPS",
      });
      allGroups.value = fetchGroup.body;
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const getGroupsOfUser = async (id) => {
    try {
      const groupOfUser = await DataProvider({
        providerType: "GROUPS",
        type: "GET_GROUPS_USER",
        params: id,
      });
      setGroupsUser(groupOfUser.body);
    } catch (error) {
      console.error(error);
    }
  };

  const addGroup = async ({ dataGroup, idUser }) => {
    isLoading.value = true;
    try {
      await DataProvider({
        providerType: "GROUPS",
        type: "INSERT_GROUP",
        params: JSON.parse(JSON.stringify(dataGroup)),
      });
      await getGroups(idUser);
    } catch (error) {
      console.error("Error adding group:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const addGuestInGroup = async (data) => {
    console.log("ADD GUEST =>", data);
    try {
      await DataProvider({
        providerType: "GUESTS",
        type: "INSERT_GUEST",
        params: JSON.parse(JSON.stringify(data)),
      });
    } catch (error) {
      console.error("Error adding guest to group:", error);
    }
  };

  const setCurrentGroup = (newGroup) => {
    group.value = newGroup;
  };

  return {
    group,
    groups,
    groupsUser,
    getGroups,
    setGroups,
    getGroupsOfUser,
    getAllGroups,
    setGroupsUser,
    allGroups,
    addGroup,
    addGuestInGroup,
    setCurrentGroup,
    isLoading,
  };
};
