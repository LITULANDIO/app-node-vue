<template>
  <Modal
    :header="$t('modals.addGuest.header')"
    :show="isOpen"
    @onClose="onClose"
  >
    <VForm
      :validation-schema="schema"
      :initial-values="guest"
      v-slot="{ meta: formMeta, errors: formErrors }"
      type="submit"
      @submit="onSubmit"
    >
      <TextField
        type="text"
        name="name"
        label="Name"
        :placeholder="$t('modals.addGuest.field1')"
        icon="fa-user"
        v-model="guest.name"
        :value="guest.name"
        @keyup="onKeyUp"
      />
      <Search
        :isShow="isShowDropdownUsers"
        :users="users"
        :guest="guest"
        :isGuest="isExistedGuest"
        @onClicked="onClicked"
      />
      <TextField
        type="text"
        name="send"
        label="Email"
        :placeholder="$t('modals.addGuest.field3')"
        icon="fa-envelope"
        v-model="guest.send"
        :value="guest.send"
      />
      <TextField
        type="text"
        name="to"
        label="Email"
        :placeholder="$t('modals.addGuest.field2')"
        icon="fa-envelope"
        v-model="guest.to"
        :value="guest.to"
      />
      <div>
        <button
          :class="{
            'cursor-pointer button': formMeta.valid,
            'cursor-not-allowed btn-allowed': !formMeta.valid,
          }"
        >
          {{ $t("modals.addGuest.button") }}
        </button>
      </div>
    </VForm>
  </Modal>
</template>

<script setup>
import { object, string, ref as yupRef } from "yup";

//# props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  guest: {
    type: Object,
    required: true,
  },
  isShowDropdownUsers: {
    type: Boolean,
    default: false,
  },
  isExistedGuest: {
    type: Boolean,
    default: false,
  },
  users: {
    type: Array,
    required: true,
  },
});
//#end

//# emits
const emit = defineEmits(["onClose", "onSubmit", "onKeyUp", "onClicked"]);

const onClose = () => emit("onClose");
const onSubmit = () => emit("onSubmit");
const onKeyUp = () => emit("onKeyUp");
const onClicked = ($event, id) => emit("onClicked", $event, id);

//#

//# const ref
const schema = object({
  name: string().required(),
  send: string().required(),
});
//#end
</script>

<style lang="scss" scoped>
.button {
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
