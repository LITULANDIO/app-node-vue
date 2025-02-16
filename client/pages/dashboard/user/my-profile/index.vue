<template>
  <NuxtLayout />
  <h1 class="text-2xl capitalize text-center text-white">
    {{ $t("pages.profile.header") }}
  </h1>
  <section>
    <div class="flex">
      <BackButton class="mt-10" />
      <div class="flex justify-end img-preview">
        <img :src="localImage" />
      </div>
    </div>
    <form>
      <div class="input-file">
        <input
          type="file"
          name="file"
          @change="onPreviewImg"
          accept="image/png, image/jpeg"
          id="file_input"
        />
        <small
          v-if="showEdit"
          class="flex justify-end cursor-pointer text-white edit-image"
          @click="onSelectImage"
          >{{ $t("pages.profile.edit") }}</small
        >
        <small
          class="flex justify-end cursor-pointer text-white save-image"
          v-else
          @click="onupdatePhoto"
          >{{ $t("pages.profile.save") }}</small
        >
      </div>
    </form>
    <Modal :show="showModalSuccess" @onClose="onCloseModalSuccess" padding>
      <div class="text-center">
        <font-awesome-icon
          icon="fa-solid fa-circle-check"
          class="icon text-teal-600 text-3xl mb-2"
        />
        <p class="mb-3">{{ $t("modals.successPhoto.text") }}</p>
      </div>
    </Modal>
    <form class="form-lang">
      <label for="locale-select" class="text-white"
        >{{ $t("language") }}:
      </label>
      <select
        id="locale-select"
        v-model="$i18n.locale"
        @change="updateLanguage($i18n.locale)"
      >
        <option value="en-US">en-US</option>
        <option value="es-ES">es-ES</option>
        <option value="cat-CAT">cat-CAT</option>
        <option value="fr-FR">fr-FR</option>
      </select>
    </form>
    <div class="mt-5">
      <span class="text-white">{{ $t("pages.profile.password") }}</span>
      <VForm
        class="card"
        :validation-schema="schema"
        :initial-values="dataUser"
        v-slot="{ meta: formMeta, errors: formErrors }"
        @submit.prevent="onChangePassword"
      >
        <div class="container-password">
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
        </div>
        <div>
          <button
            type="submit"
            @click="onChangePassword"
            :class="{
              'cursor-pointer button': formMeta.valid,
              'cursor-not-allowed btn-allowed': !formMeta.valid,
            }"
          >
            {{ $t("modals.addGuest.button") }}
          </button>
        </div>
      </VForm>
      <ModalSuccess
        :showModal="showModalSuccessPassw"
        :text="$t('modals.successPassword.text')"
        @onCloseModal="onCloseModalSuccessPassw"
      />
    </div>
  </section>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";
import { DataProvider } from "@/data-provider/index";
import { useAuth } from "@/composables/useAuth";
import { useUsers } from "@/composables/useUsers";
import { useI18n } from "vue-i18n";

//# const ref reactive
const { uploadImage, getUser, currentUser } = useUsers();
const { user: authUser } = useAuth();
const dataUser = reactive({ password: "", confirmed: "", photo: "" });
const localImage = ref(null);
const showEdit = ref(true);
const showModalSuccess = ref(false);
const showModalSuccessPassw = ref(false);
const imageRef = ref(null);
const i18n = useI18n();
configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});
const schema = object({
  password: string().required().min(8).label("Your Password"),
  confirmed: string()
    .required()
    .oneOf([yupRef("password")], "La contrassenya no coincideix")
    .label("La confirmació de la contras"),
});
//#end

//#cycle life
onMounted(async () => {
  localImage.value = imageRef.value || authUser.value.photo;
  DataProvider({
    providerType: "USERS",
    type: "GET_USER",
    params: authUser.value.id,
  }).then((res) => {
    authUser.value.photo = res.body[0].photo;
  });
});
//#

watch(currentUser, (newVal) => {
  console.log({ newVal });
  imageRef.value = newVal.photo;
});

//# functions
const onChangePassword = async () => {
  const data = {
    password: dataUser.password,
    id: authUser.value.id,
  };
  await DataProvider({
    providerType: "AUTH",
    type: "UPDATE_PASSWORD",
    params: JSON.parse(JSON.stringify(data)),
  });
  if (dataUser.password) {
    showModalSuccessPassw.value = true;
  }
  setTimeout(() => {
    dataUser.confirmed = "";
    dataUser.password = "";
    showModalSuccessPassw.value = false;
  }, 3000);
};
const onPreviewImg = async (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => (localImage.value = e.target.result);
    reader.readAsDataURL(input.files[0]);
    dataUser.photo = await uploadImage(input.files[0]);
  }
};
const onSelectImage = () => {
  showEdit.value = false;
  document.getElementById("file_input").click();
};
const onupdatePhoto = async () => {
  const data = {
    photo: dataUser.photo,
    id: authUser.value.id,
  };
  await DataProvider({
    providerType: "USERS",
    type: "UPDATE_PHOTO",
    params: data,
  });
  try {
    await getUser(authUser.value.id);
    showEdit.value = true;
    showModalSuccess.value = true;
    authUser.value.photo = currentUser.value.photo;
    showModalSuccess.value = false;
  } catch (error) {
    console.error(error);
  }
};
const onCloseModalSuccess = () => {
  showModalSuccess.value = false;
};
const onCloseModalSuccessPassw = () => {
  showModalSuccessPassw.value = false;
};
const updateLanguage = (lang) => {
  if (process.client) {
    localStorage.setItem("lang", lang);
  }
};
//#end
</script>

<style lang="scss" scoped>
.text-center {
  text-shadow: 2px 2px 4px rgba(4, 192, 168, 0.7651654412);
}
section {
  margin-left: 1rem;
  background-color: #3f3e3e;
  border: 2px solid rgba(4, 192, 168, 0.7651654412);
  box-shadow: 0 0 0 0.2rem #3f3e3e;
  position: absolute;
  width: 83%;
  border-radius: 25px;
  padding-left: 2.5rem;
  padding-bottom: 3rem;
  margin-top: 2rem;
  .form-lang {
    margin-top: 1rem;
    select {
      padding: 0.5rem;
      border-radius: 15px;
    }
  }
  .container-password {
    padding-right: 4.5rem;
  }
}
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
.img-preview img {
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(4, 192, 168, 0.7651654412);
  width: 100px;
  height: 100px;
  position: absolute;
  top: 1rem;
  right: 2rem;
  object-fit: cover;
}
.file-custom {
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
.edit-image {
  margin-top: 5.5rem;
  margin-right: 3rem;
}
.save-image {
  margin-top: 5.5rem;
  margin-right: 3.7rem;
}
.input-file input[type="file"] {
  display: none;
}
</style>
