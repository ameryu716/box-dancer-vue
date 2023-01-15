<template>
    <div
        v-if="is_folder"
        class="folder-box fl j-c"
        :class="{ 'is-open': is_open }"
        @click="folderOpenToggle"
    >
        <span>{{ name }}</span>
    </div>
    <div
        v-else
        class="box fl j-c"
        :style="{ 'box-shadow': '0 0 3px 1px ' + color }"
    >
        <span>{{ name }}</span>
        <a :href="url" target="_blank"></a>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
    url: string;
    name: string;
    is_folder: boolean;
    is_open: boolean;
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
    width: 120px;
    height: 120px;
    // box-shadow: 0 0 3px 1px rgba($color: #000000, $alpha: 0.6);
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

.folder-box {
    position: relative;
    width: 120px;
    height: 120px;
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
</style>
