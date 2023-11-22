<template>
  <Modal :show="showModalForgotPassw" @onClose="onCloseModal" padding>
        <div class="text-center w-100">
            <font-awesome-icon icon="fa-solid fa-circle-info" class="icon text-teal-600 text-3xl mb-2" />
            <p class="mb-3">{{ $t('modals.forgotPassword.text') }}</p>
            <div class="w-100">
            <VForm
                :validation-schema="schema"
                :initial-values="mailForgot"
                v-slot="{ meta: formMeta, errors: formErrors }"
                type="submit"
                @submit.prevent="onSubmit"
              >
                <TextField
                    type="email"
                    name="email"
                    label="Name"
                    :placeholder="$t('register.email')"
                    icon="fa-envelope"
                    v-model="mailForgot.mail"
                    :value="mailForgot.mail"
                    class="max-width"
                />
                <button
                    class="button mt-3 hover:text-slate	"
                    type="submit"
                    @click="onSubmit"
                >
              {{ $t('modals.forgotPassword.send') }}
            </button>
            </VForm>
            </div>
          </div>
    </Modal>
</template>

<script setup>
import { ref } from 'vue'
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";

const props = defineProps({
    showModalForgotPassw: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(["onCloseModal", "onSubmit"])
configure({
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});
const schema = object({
  email: string().required().email()
});

const mailForgot = ref({mail: ""})

const onCloseModal = () => {
    emit('onCloseModal')
}
const onSubmit = () => {
    emit('onSubmit', mailForgot.value.mail)
}
</script>

<style lang="scss" scoped>
  .button-disabled{
      padding: 0.5rem;
      border: 1px solid;
      border-radius: 0.3rem;
      color: #dbdbdb;
      &:hover{
        box-shadow: 0px 0px 0px 1px white;
        border-radius: 0.3rem;
        background-color: #3F3E3E;
        color: white
      }
  }
  .button{
      padding: 0.5rem;
      border: 1px solid;
      border-radius: 0.3rem;
      color: #dbdbdb;
  }

  .btn-allowed{
      padding: 0.5rem;
      border: 1px solid;
      border-radius: 0.3rem;
      color: #dbdbdb;
  }
  .max-width{
  max-width: 89%;
 }
</style>