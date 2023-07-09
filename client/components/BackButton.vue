<template>
<div class="back-button-box" @click="onBackButon">
    <div class="back-button-icon -mt-5">
        <div class="i-carbon-arrow-left"></div>
    </div>
</div>
</template>

<script setup>
const router = useRouter();
const onBackButon = () =>  router.back()
</script>

<style lang="scss" scoped>
.back-button-icon {
    position: absolute;
    color: white;
    left: 2.5rem;
    border: 2px solid rgba(4, 192, 168, 0.7651654412);
    box-shadow: 0 0 0 0.2rem #3F3E3E;
    border-radius: 25px;
    background-color: #3F3E3E;
    padding: 0.5rem;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .i-carbon-arrow-left {
        --un-icon: url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m14 26l1.41-1.41L7.83 17H28v-2H7.83l7.58-7.59L14 6L4 16l10 10z'/%3E%3C/svg%3E");
        -webkit-mask: var(--un-icon) no-repeat;
        mask: var(--un-icon) no-repeat;
        -webkit-mask-size: 100% 100%;
        mask-size: 100% 100%;
        background-color: currentColor;
        color: inherit;
        width: 1.5rem;
        height: 1.5em;
    }
}
</style>