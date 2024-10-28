import { ref, watch } from "vue";

export function useFriend(groupId) {
  const friend = ref(null);

  const loadFriendFromLocalStorage = () => {
    const storedFriends = JSON.parse(localStorage.getItem("friends")) || {};
    friend.value = storedFriends[groupId] || null;
  };

  loadFriendFromLocalStorage();

  watch(
    friend,
    (newValue) => {
      const storedFriends = JSON.parse(localStorage.getItem("friends")) || {};
      if (newValue) {
        storedFriends[groupId] = newValue;
      } else {
        delete storedFriends[groupId];
      }
      localStorage.setItem("friends", JSON.stringify(storedFriends));
    },
    { deep: true }
  );

  const setFriend = (newFriend) => {
    friend.value = newFriend;
  };

  const getFriend = () => {
    return friend.value;
  };

  return {
    friend,
    setFriend,
    getFriend,
  };
}
