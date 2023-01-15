<template>
    <n-modal width="600px" v-model:show="is_show" :on-after-leave="close">
        <n-card style="width: 700px; height: 500px" class="card">
            <n-code :code="json" :word-wrap="true"> </n-code>
            <n-button class="float-btn" @click="copy(json)">
                <n-icon>
                    <cpicon />
                </n-icon>
            </n-button>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, unref } from "vue";
import { Copy as cpicon } from "@vicons/carbon";
import { copy } from "../scripts/util";
const props = defineProps<{
    json: string;
}>();
const emits = defineEmits<{
    (event: "close"): void;
}>();
const is_show = ref(false);
function close() {
    emits("close");
}
onMounted(() => {
    is_show.value = true;
});
</script>

<style lang="scss" scoped>
.card {
    position: relative;
    .float-btn {
        position: absolute;
        bottom: 4%;
        right: 3%;
    }
}
</style>
