<template>
    <div
        v-if="data.is_folder"
        class="folder-box fl j-c"
        :class="{ 'is-open': data.is_open }"
        @click="folderOpenToggle"
    >
        <span>{{ data.name }}</span>
        <b>{{ data.id }}</b>
    </div>
    <div
        v-else
        class="box fl j-c"
        :style="{ 'box-shadow': '0 0 3px 1px ' + color }"
    >
        <span>{{ data.name }}</span>
        <b>{{ data.id }}</b>
        <a :href="data.url" target="_blank"></a>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { type_assembled_box } from "../types";

const props = defineProps<{
    data: type_assembled_box;
    color: string;
}>();

const rotating = ref(false);

const emits = defineEmits<{
    (event: "folder-open-toggle"): void;
}>();

function folderOpenToggle() {
    rotating.value = !rotating.value;
    emits("folder-open-toggle");
}
</script>
<style lang="scss">
@use "../color.scss" as color;

.box {
    position: relative;
    width: 130px;
    height: 130px;
    padding: 0.7rem;
    box-sizing: border-box;
    // box-shadow: 0 0 3px 1px rgba($color: #000000, $alpha: 0.6);
    cursor: pointer;
    font-size: 1rem;
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

.folder-box {
    position: relative;
    width: 130px;
    height: 130px;
    padding: 0.7rem;
    box-sizing: border-box;
    cursor: pointer;
    transition: 0.5s;
    clip-path: polygon(
        0 0,
        100% 0,
        100% calc(100% - 1rem),
        calc(100% - 1rem) 100%,
        0 100%,
        0px 100%,
        0px 0
    );
    border: solid 2px rgba($color: #59a2dd, $alpha: 0.8);
    font-size: 1rem;
    &:hover {
        filter: drop-shadow(0 0 1em color.$glass);
        @media (prefers-color-scheme: dark) {
            filter: drop-shadow(0 0 1em color.$white);
        }
    }

    &.is-open {
        border-color: rgba($color: #64dd59, $alpha: 0.8);
        transform: rotateZ(360deg);
    }
}

b {
    position: absolute;
    top: 0;
    right: 0;
}
</style>
