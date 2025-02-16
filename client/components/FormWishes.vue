<template>
  <Modal
    :header="$t('modals.wishes.header')"
    :show="isOpen"
    @onClose="onClose"
    top="20%"
  >
    <VForm
      :validation-schema="schema"
      :initial-values="dataWishes"
      v-slot="{ meta: formMeta, errors: formErrors }"
      @submit="onSubmitWishes"
    >
      <TextField
        type="text"
        name="wish1"
        label="Wish1"
        :placeholder="$t('modals.wishes.wish1')"
        icon="fa-gift"
        v-model="dataWishes.wish1"
        :value="dataWishes.wish1"
      />
      <TextField
        type="text"
        name="wish2"
        label="Wish2"
        :placeholder="$t('modals.wishes.wish2')"
        icon="fa-gift"
        v-model="dataWishes.wish2"
        :value="dataWishes.wish2"
      />
      <TextField
        type="text"
        name="wish3"
        label="Wish3"
        :placeholder="$t('modals.wishes.wish3')"
        icon="fa-gift"
        v-model="dataWishes.wish3"
        :value="dataWishes.wish3"
      />
      <TextField
        type="text"
        name="wish4"
        label="Wish4"
        :placeholder="$t('modals.wishes.wish4')"
        icon="fa-gift"
        v-model="dataWishes.wish4"
        :value="dataWishes.wish4"
      />
      <TextField
        type="text"
        name="wish5"
        label="Wish5"
        :placeholder="$t('modals.wishes.wish5')"
        icon="fa-gift"
        v-model="dataWishes.wish5"
        :value="dataWishes.wish5"
      />
      <div>
        <button
          :class="{
            'cursor-pointer button-disabled': formMeta.valid,
            'cursor-not-allowed btn-allowed': !formMeta.valid,
          }"
        >
          {{ $t("modals.wishes.button") }}
        </button>
      </div>
    </VForm>
  </Modal>
  <Modal :show="showModalError" @onClose="onCloseModalError" padding>
    <div class="text-center">
      <font-awesome-icon
        icon="fa-solid fa-triangle-exclamation"
        class="icon text-orange-300 text-3xl mb-2"
      />
      <p class="mb-3">{{ $t("modals.errorWishes.text") }}</p>
    </div>
  </Modal>
  <Modal :show="showModalSuccess" @onClose="onCloseModalSuccess" padding>
    <div class="text-center">
      <font-awesome-icon
        icon="fa-solid fa-circle-check"
        class="icon text-teal-600 text-3xl mb-2"
      />
      <p class="mb-3">{{ $t("modals.successWishes.text") }}</p>
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, onMounted, watchEffect } from "vue";
import { object, string, ref as yupRef } from "yup";
import { DataProvider } from "@/data-provider/index";
import { useAuth } from "@/composables/useAuth";
import { useGroups } from "@/composables/useGroups";
import { useFriend } from "@/composables/useFriend";

//# props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    required: true,
  },
  wishes: {
    type: Object,
  },
});
//#end

//# const ref
const { user: authUser } = useAuth();
const { group, setGroupsUser, groupsUser } = useGroups();
const { setFriend } = useFriend(group.value.id);

const schema = object({
  wish1: string().required(),
  wish2: string().required(),
});
let dataWishes = reactive({
  idUser: "",
  idGroup: "",
  wish1: "",
  wish2: "",
  wish3: "",
  wish4: "",
  wish5: "",
});
const showModalError = ref(false);
const showModalSuccess = ref(false);
//#end

//# cycle life
onMounted(() => {
  dataWishes.wish1 = props.wishes.wish1;
  dataWishes.wish2 = props.wishes.wish2;
  dataWishes.wish3 = props.wishes.wish3;
  dataWishes.wish4 = props.wishes.wish4;
  dataWishes.wish5 = props.wishes.wish5;
});
//#end

//# emits
const emit = defineEmits(["onClose", "onSubmit", "onSubmitSuccess"]);
const onClose = () => emit("onClose");
//#

//# events
const onCloseModalError = () => (showModalError.value = false);
const onCloseModalSuccess = () => (showModalSuccess.value = false);
//#end

//#methods
const onSubmitWishes = async () => {
  dataWishes.idGroup = props.data.idGroup;
  dataWishes.idUser = props.data.idUser;
  try {
    await DataProvider({
      providerType: "WISHES",
      type: "INSERT_WISHES",
      params: JSON.parse(JSON.stringify(dataWishes)),
    });
    const groupsOfUser = await DataProvider({
      providerType: "GROUPS",
      type: "GET_GROUPS_USER",
      params: authUser.value.id,
    });
    setGroupsUser(groupsOfUser.body);

    groupsUser.value.forEach((grup) => {
      if (grup.group.id === group.value.id) {
        setFriend(grup);
      }
    });
    emit("onSubmitSuccess");
    showModalSuccess.value = true;
    setTimeout(() => {
      showModalSuccess.value = false;
    }, 3000);
  } catch (error) {
    showModalError.value = true;
  }
};
//#end
</script>

<style lang="scss" scoped>
.button-disabled {
  padding: 0.5rem;
  border: 1px solid;
  border-radius: 0.3rem;
  color: #dbdbdb;
  &:hover {
    box-shadow: 0px 0px 0px 1px white;
    border-radius: 0.3rem;
    background-color: #3f3e3e;
    color: white;
  }
}
.btn-allowed {
  padding: 0.5rem;
  border: 1px solid;
  border-radius: 0.3rem;
  color: #dbdbdb;
}
</style>
