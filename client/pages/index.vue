<template>
  <div class="wrapper">
    <div class="flex justify-center items-center">
      <div class="box-slogan">
        <img class="slogan" src="/friends.png" />
      </div>
      <div
        class="sm:w-11/12 md:w-8/12 max-w-md  pl-5 pr-5 "
      >
        <VForm
          class="card"
          :validation-schema="schema"
          :initial-values="dataUser"
          v-slot="{ meta: formMeta, errors: formErrors }"
          @submit.prevent="onLogin"
        >
          <h1 class="display mt-2 mb-5">{{ $t('login.login') }}</h1>
          <TextField
            type="text"
            name="email"
            label="Email"
            :placeholder="$t('register.email')"
            icon="fas fa-envelope"
            v-model="dataUser.email"
            :value="dataUser.email"
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            :placeholder="$t('register.password')"
            icon="fas fa-lock"
            v-model="dataUser.password"
            :value="dataUser.password"
          />
          <span class="text-sm text-red-600 block" style="width: 110%;">{{ errorLogin ? $t('login.error') : '' }}</span>
          <div class="flex justify-between w-custom absolute">
            <small class="underline text-white" @click="onShowModalForgotPassw">Forgot password</small>
            <nuxt-link class="-mt-1" to="/register"><small class="">{{ $t('login.hasRegister') }}</small></nuxt-link>
          </div>
          <div class="flex items-center justify-between mt-6" style="width:111%">
            <button
              class="button mt-3 hover:text-slate	"
              :class="{ 'cursor-pointer': formMeta.valid, 'cursor-not-allowed': !formMeta.valid }"
              :disabled="!formMeta.valid"
              type="submit"
              @click="onLogin"
            >
              {{ $t('login.signIn') }}
            </button>
          </div>
        </VForm>
        <footer>
          <small class="flex justify-center font-bold text-white powered-litus" data-text="Powered by Litus">Powered by Litus ❤️</small>
        </footer>
      </div>
    </div>
    <ModalForgotPassword 
      :showModalForgotPassw="showModalForgotPassw" 
      @onSubmit="onSubmitForgotPassword"
      @onCloseModal="onCloseModalForgotPassw"/>
    <ModalSuccess 
      :showModal="showModalSuccess" 
      :text="$t('modals.successPassword.text')" 
      @onCloseModal="onCloseModalSuccess" />
    <!-- <div class="flex items-center justify-center mt-5" @click="onOpenModal"><div class="join-group text-center" data-text="UNIRSE A UN GRUP">UNIRSE A UN GRUP</div></div> -->
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { DataProvider } from "@/data-provider/index"
import { storeToRefs } from 'pinia'
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";
import { useStoreAuth } from '~~/stores/auth';
import uniqid from 'uniqid'

const storeAuth = useStoreAuth()
const { user } = storeToRefs(storeAuth)
const errorLogin = ref('')
const dataUser = reactive({ email: "", password: ""})
const showModalForgotPassw = ref(false)
const showModalSuccess = ref(false)

const onLogin = async () => {
  const result = await DataProvider({
        providerType: 'AUTH',
        type: 'LOGIN',
        params: dataUser
      })
  if(result?.data?.body?.error){
    errorLogin.value = result.data.body.msg
  } else {
    const fetchUser = await DataProvider({
      providerType: 'USERS',
      type: 'GET_USER',
      params: result.data.body.id
    })
    user.value.id = result.data.body.id,
    user.value.name = result.data.body.user
    user.value.lastname = result.data.body.lastname
    user.value.photo = fetchUser.body[0].photo
    user.value.email = fetchUser.body[0].email
    navigateTo(`/dashboard/user`);
  }
};

configure({
  validateOnBlur: true, // controls if `blur` events should trigger validation with `handleChange` handler
  validateOnChange: true, // controls if `change` events should trigger validation with `handleChange` handler
  validateOnInput: false, // controls if `input` events should trigger validation with `handleChange` handler
  validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});
const schema = object({
  email: string().required(),
  password: string().required().label("Your Password"),
});

const onShowModalForgotPassw = () => {
  showModalForgotPassw.value = true
}
const onCloseModalForgotPassw = () => {
  showModalForgotPassw.value = false
}
const onCloseModalSuccess = () => {
  showModalSuccess.value = false
}
const onSubmitForgotPassword = async (email) => {
  const getUsers = await DataProvider({
      providerType: 'USERS',
      type: 'GET_USERS',
    })
  const userMail = getUsers.body.find(user => user.email === email)
  if (userMail) {
    const uniqueId = uniqid();
    const data = {
        password: uniqueId,
        id: userMail.id
    }
    DataProvider({
        providerType: 'AUTH',
        type: 'UPDATE_PASSWORD',
        params: JSON.parse(JSON.stringify(data))
    }).then(_ => {
      showModalSuccess.value = true
    })

    DataProvider({
      providerType: 'MAIL',
      type: 'SENDMAILFORGOT',
      params: {
        to: userMail.email,
        password: uniqueId
        
      }
    })
    showModalForgotPassw.value = false
    setTimeout(() => {
      showModalSuccess.value = false
    },4000)
  } else {
    return false
  }
}

</script>

<style lang="scss" scoped>
 .wrapper {
  height: calc(100vh - 199px);
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  .card{
      border-radius: 1rem;
      box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%);
      /* color: #4a4a4a; */
      background-color: #3F3E3E;
      color: white;
      margin-bottom: 2rem;
      border: 2px solid rgba(4,192,168,0.7651654411764706);
      box-shadow: 0 0 0 0.2rem #3F3E3E;
      max-width: 100%;
      position: relative;
      padding: 2rem;
      padding-right: 4rem;
      margin-top: 10rem;
  }
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
 .box-slogan {
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  top: -4rem;
  @media (max-height: 757px) {
    top: -8rem;
  }
  @media (min-height: 758px) and (max-width: 900px) {
    top: -1rem;
  }
  @media (max-width: 414px) {
    top: -7rem;
  }
  @media (max-width: 375px) and (max-height: 875px) {
    top: -8rem;
  }

  .slogan {
    width: 240px;
   }  
  }

  .powered-litus{
    color: white;
    white-space: nowrap;
    &:hover{
      opacity: 0.9;
    }
    &:before{
      text-shadow: 0px 0px 50px  rgba(4, 192, 168, 0.7651654412);
      position: absolute;
      content: attr(data-text);
      animation: flicker 8s linear forwards;
      filter: blur(10px) brightness(0);
      animation-delay: 1s;
    }
  }
  @keyframes flicker{
    0%{
      filter: blur(5px) brightness(1);
    }
    3%{
      filter: blur(5px) brightness(0);
    }
    6%{
      filter: blur(5px) brightness(0);
    }
    7%{
      filter: blur(5px) brightness(1);
    }
    8%{
      filter: blur(5px) brightness(0);
    }
    9%{
      filter: blur(5px) brightness(1);
    }
    10%{
      filter: blur(5px) brightness(0);
    }
    20%{
      filter: blur(5px) brightness(1);
    }
  }
 }

 .btn-allowed{
      padding: 0.5rem;
      border: 1px solid;
      border-radius: 0.3rem;
      color: #dbdbdb;
  }
.w-custom {
 width: 17.7rem;
}
  
</style>
