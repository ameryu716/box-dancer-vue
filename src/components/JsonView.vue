<template>
    <n-modal width="600px" v-model:show="is_show" :on-after-leave="close">
        <n-card class="card" style="width: 700px; height: 500px">
            <div class="card-wrapper">
                <div class="y-wrapper">
                    <n-code
                        v-if="!import_mode"
                        :code="json"
                        :word-wrap="true"
                    />

                    <n-input
                        v-if="import_mode"
                        v-model:value="edit_json"
                        type="textarea"
                        style="height: 400px"
                    />
                </div>
                <div class="fl mt-3">
                    <div class="border-item">
                        インポートモード
                        <n-switch
                            class="ms-2"
                            :round="false"
                            v-model:value="import_mode"
                        />
                    </div>

                    <n-button
                        class="ms-2"
                        v-if="import_mode"
                        @click="saveData"
                        type="warning"
                        strong
                        secondary
                    >
                        Import
                    </n-button>
                    <div class="ms-auto fl j-end" v-if="!import_mode">
                        <n-button @click="copy(json)">
                            <n-icon>
                                <cpicon />
                            </n-icon>
                        </n-button>
                    </div>
                </div>
            </div>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, unref } from "vue";
import { Copy as cpicon, ImportExport } from "@vicons/carbon";
import { copy, niConfirm, setMemoryFromJson } from "../scripts/util";
import { useDialog } from "naive-ui";
const props = defineProps<{
    json: string;
}>();
const emits = defineEmits<{
    (event: "close"): void;
}>();
const is_show = ref(false);
const import_mode = ref(false);
const dialog = useDialog();
const edit_json = ref("");

function close() {
    emits("close");
}

async function saveData() {
    await niConfirm(
        "warn",
        "JSONインポート",
        "JSONインポート機能は破壊的です。誤ったデータをインポートすると全てのボックスの表示が中断されます。\n使用には細心の注意を払い、自己責任で行ってください。",
        "続ける"
    ).then((r) => {
        setMemoryFromJson(edit_json.value);
    });
}
onMounted(() => {
    is_show.value = true;

    edit_json.value = props.json;
});
</script>

<style lang="scss" scoped>
.card {
    position: relative;
    .card-wrapper {
        height: 500px;

        .y-wrapper {
            height: 80%;
            overflow-y: scroll;
        }
    }
}
</style>
