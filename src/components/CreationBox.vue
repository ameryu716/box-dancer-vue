<template>
    <div class="create-box fl j-c" @click="openModal">
        <n-icon size="28">
            <add-alt />
        </n-icon>
        <span class="ms-2">新規</span>
    </div>
</template>
<script lang="ts" setup>
import { AddAlt } from "@vicons/carbon";
import { ref } from "vue";

const emits = defineEmits<{
    (event: "create-modal-open"): void;
}>();

function openModal() {
    emits("create-modal-open");
}
</script>
<style lang="scss">
@use "../color.scss" as color;

.create-box {
    width: 120px;
    height: 120px;
    box-shadow: 0 0 3px 1px rgba($color: #000000, $alpha: 0.6);
    cursor: pointer;
    &:hover {
        filter: drop-shadow(0 0 1em color.$rain);
        @media (prefers-color-scheme: dark) {
            filter: drop-shadow(0 0 1em color.$white);
        }
    }
}
</style>
