<template>
    <div class="box fl j-c">
        <span>{{ name }}</span>
        <a :href="url" target="_blank"></a>
    </div>
    <div
        class="folder-box fl j-c"
        :class="{ rotating: rotating }"
        @click="folderOpenToggle"
    >
        <span>{{ name }}</span>
    </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
    url: string;
    name: string;
    is_folder: boolean;
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

    &.rotating {
        transform: rotateZ("720deg");
    }
}
</style>
