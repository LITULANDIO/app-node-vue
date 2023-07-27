<template>
    <Modal :header="$t('modals.wishes.header')" :show="isOpen" @onClose="onClose" style="top: 45% !important">
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
                <div><button :class="{ 'cursor-pointer button-disabled': formMeta.valid, 'cursor-not-allowed btn-allowed': !formMeta.valid }">{{ $t('modals.wishes.button') }}</button></div>
        </VForm>F8fehQ76
    </Modal>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { object, string, ref as yupRef } from "yup";
import { DataProvider } from '@/data-provider/index'

//# props
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    data: {
        type: Object,
        required: true
    },
    wishes: {
        type: Object
    }
})
//#end
//# cycle life
onMounted(() => {
    dataWishes.wish1 = props.wishes.wish1
    dataWishes.wish2 = props.wishes.wish2
    dataWishes.wish3 = props.wishes.wish3
    dataWishes.wish4 = props.wishes.wish4
    dataWishes.wish5 = props.wishes.wish5
})
//#end
//# emits
const emit = defineEmits(['onClose', 'onSubmit'])
const onClose = () => emit("onClose")
//#

//# const ref
const schema = object({
  wish1: string().required(),
  wish2: string().required(),
});
let dataWishes = reactive({
    idUser: '',
    idGroup: '',
    wish1: '',
    wish2: '',
    wish3: '',
    wish4: '',
    wish5: ''
})
//#end

//#methods
const onSubmitWishes = async () => {
    dataWishes.idGroup = props.data.idGroup
    dataWishes.idUser = props.data.idUser
    console.log({dataWishes})
    await DataProvider({
          providerType: 'WISHES',
          type: 'INSERT_WISHES',
          params: JSON.parse(JSON.stringify(dataWishes))
        })
    if (!props.wishes.wish1) {
        dataWishes = {
            wish1: '',
            wish2: '',
            wish3: '',
            wish4: '',
            wish5: ''
        }
    }
}
//#end
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
.btn-allowed{
      padding: 0.5rem;
      border: 1px solid;
      border-radius: 0.3rem;
      color: #dbdbdb;
  }
</style>