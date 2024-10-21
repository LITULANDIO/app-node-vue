import { ref, watch } from 'vue'

export function useFriend() {
  const friend = ref(JSON.parse(localStorage.getItem('friend-me')) || null)

  watch(friend, (newValue) => {
    if (newValue) {
      localStorage.setItem('friend-me', JSON.stringify(newValue))
    }
  }, { deep: true })

  const setFriend = (newFriend) => {
    friend.value = newFriend
  }

  const getFriend = () => {
    return friend.value
  }

  return {
    friend,
    setFriend,
    getFriend
  }
}