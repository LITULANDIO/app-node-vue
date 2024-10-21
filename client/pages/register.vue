<template>
    <div class="wrapper">
      <div class="flex justify-center">
        <div class="sm:w-11/12 md:w-8/12 max-w-md  pl-5 pr-5 " >
          <VForm
            class="card"
            :validation-schema="schema"
            :initial-values="dataUser"
            v-slot="{ meta: formMeta, errors: formErrors }"
            @submit.prevent="onSubmit">
            <h2 class="display mt-2 mb-8">{{ $t('register.register') }}</h2>
            <div class="flex justify-end img-preview mb-2">
              <img v-show="localImage" :src="localImage" /> 
            </div>
            <TextField
                type="text"
                name="user"
                label="User"
                :placeholder="$t('register.user')"
                icon="fas fa-user"
                check
                v-model="dataUser.user"
                :value="dataUser.user"
                />
                <TextField
                type="text"
                name="user"
                label="User"
                :placeholder="$t('register.lastname')"
                icon="fas fa-user"
                check
                v-model="dataUser.lastname"
                :value="dataUser.lastname"
                />
            <div class="input-file">
              <input 
                type="file"
                name="file"
                @change="onPreviewImg"
                v-show="false"
                accept="image/png, image/jpeg"
                id="file_input">
                <div class="file-custom" @click="onSelectImage">{{ $t('register.selectImage') }}</div>
            </div>
            <TextField
              type="email"
              name="email"
              label="Email"
              :placeholder="$t('register.email')"
              icon="fas fa-envelope"
              check
              v-model="dataUser.email"
              :value="dataUser.email"
            />
            <TextField
              type="password"
              name="password"
              label="Password"
              :placeholder="$t('register.password')"
              icon="fas fa-lock"
              check
              v-model="dataUser.password"
              :value="dataUser.password"
            />
            <TextField
              type="password"
              name="confirmed"
              label="Confirm Password"
              :placeholder="$t('register.confirmPass')"
              icon="fas fa-lock"
              check
              v-model="dataUser.confirmed"
              :value="dataUser.confirmed"
            />
            <div class="flex items-center justify-between" style="width:111%">
                <button
                class="button mt-3 hover:text-slate	"
                :class="{ 'cursor-pointer': formMeta.valid, 'cursor-not-allowed': !formMeta.valid }"
                :disabled="!formMeta.valid"
                type="submit"
                @click="onSubmit"
                >
                {{ $t('register.signUp') }}
                </button>
                <nuxt-link to="/"><span class="text-xs underline">{{ $t('register.registered') }}</span></nuxt-link>
            </div>
          </VForm>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { reactive } from 'vue'
  import { object, string, ref as yupRef } from "yup";
  import { configure } from "vee-validate";
  import { useRouter } from 'vue-router';
  import { useUsers } from '@/composables/useUsers'


//#ref reactive const 
  const router = useRouter()
  const dataUser = reactive({ user: "", lastname: "", email: "", password: "", confirmed: "", photo: "" })
  const localImage = ref(null)
  const runtimeConfig = useRuntimeConfig();
  const { uploadImage } = useUsers()
  configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
  });
  const schema = object({
    email: string()
      .required()
      .email()
      .test(
        "is-taken",
        "El email ja es troba registrat",
        async (value) => !(await existingEmail(value))
      )
      .label("Email Address"),
    user: string().required(),
    password: string().required().min(8).label("Your Password"),
    confirmed: string()
      .required()
      .oneOf([yupRef("password")], "La contrassenya no coincideix")
      .label("La confirmació de la contras"),
  });
// #end

//#methods
 const existingEmail = async (email) => {
    const result = await useFetch(`${runtimeConfig.public.apiKey}/users`, { method: 'GET' })
   return result.data.value.body.find(data => data.email === email)
  };
//#end

//#events
  const onSubmit = async () => {
    dataUser.id = 0
    console.log({dataUser})
    try{
        await useFetch(`${runtimeConfig.public.apiKey}/users`, { method: 'POST', body: JSON.stringify(dataUser),  headers: { Accept: "application/json" } })
        router.back()
    }catch(error){
        console.error(error)
    }
  }
  const onPreviewImg = async (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => localImage.value = e.target.result; 
      reader.readAsDataURL(input.files[0]);
      dataUser.photo = await uploadImage(input.files[0])
    }
}
const onSelectImage = () =>{
  document.getElementById('file_input').click()
}
//#end

  </script>
  
  <style lang="scss" scoped>
   .wrapper {
    height: calc(100vh - 199px);
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    .card{
        background-color: #3F3E3E;
        color: white;
        border-radius: 15px;
        margin-bottom: 2rem;
        border: 2px solid rgba(4,192,168,0.7651654411764706);
        box-shadow: 0 0 0 0.2rem #3F3E3E;
        box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%);
        /* color: #4a4a4a; */
        max-width: 100%;
        position: relative;
        padding: 2rem;
        padding-right: 4rem;
    }
    .button{
        padding: 0.5rem;
        border: 1px solid;
        border-radius: 0.3rem;
        color: #dbdbdb;
    }
    .img-preview{
      
      img{
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(4, 192, 168, 0.7651654412);
        width: 80px;
        height: 80px;
        position: absolute;
        top: 1rem;
        right: 2rem;
        object-fit: cover;
      }
    }
    .file-custom{
      text-align: center;
      padding: 0.5rem;
      margin-right: 2rem;
      border-radius: 0.3rem;
      color: rgba(4, 192, 168, 0.7651654412);
      width: 106%;
      background-color: #1c1e21;
      box-shadow: inset 0 0.0625em 0.225em 0.032222em rgba(10, 10, 10, 0.06);
      margin-bottom: 1rem;
      margin-top: 0.5rem;
      cursor: pointer;
      //filter: sepia();
      border: 2px solid;
    }
  }
  </style>
  