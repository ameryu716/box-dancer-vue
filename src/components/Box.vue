<template>
    <div class="box fl j-c">
        <span>{{ name }}</span>
        <a :href="url" target="_blank"></a>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
    url: string;
    name: string;
}>();
</script>
<style lang="scss">
@use "../color.scss" as color;

.box {
    position: relative;
    width: 120px;
    height: 120px;
    box-shadow: 0 0 3px 1px rgba($color: #000000, $alpha: 0.6);
    cursor: pointer;
    &:hover {
        filter: drop-shadow(0 0 1em color.$glass);
        @media (prefers-color-scheme: dark) {
            filter: drop-shadow(0 0 1em color.$white);
        }
    }
    a {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
