<template>
    <n-modal
        v-model:show="is_show"
        class="modal"
        :on-after-leave="close"
        :mask-closable="false"
    >
        <n-card>
            <div class="fl">
                <h2>{{ title }}</h2>
                <n-button class="ms-auto" @click="close" strong secondary>
                    <n-icon size="24"><close-icon /></n-icon>
                </n-button>
            </div>
            <n-form
                ref="formRef"
                :label-width="80"
                :model="form"
                :rules="rules"
                size="large"
            >
                <n-form-item label="テキスト" path="name">
                    <n-input v-model:value="form.name" placeholder="Goog..." />
                </n-form-item>
                <n-form-item label="URL" path="url">
                    <n-input
                        v-model:value="form.url"
                        placeholder="https://a..."
                        :disabled="form.is_folder"
                    />
                </n-form-item>
                <n-form-item label="親" path="parent_id">
                    <n-select
                        v-model:value="form.parent_id"
                        :options="select_options"
                        placeholder="階層作成する場合は親ボックスのIDを入力してください。"
                    />
                </n-form-item>
                <div class="fl">
                    <n-form-item>
                        <div class="border-item">
                            フォルダー
                            <n-switch
                                class="ms-2"
                                :round="false"
                                v-model:value="form.is_folder"
                            />
                        </div>
                    </n-form-item>
                    <n-form-item class="ms-auto">
                        <n-button @click="send">送信</n-button>
                    </n-form-item>
                </div>
            </n-form>
        </n-card>
    </n-modal>
</template>
<script lang="ts" setup>
import { getDate } from "date-fns";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { computed, onMounted, reactive, ref, unref } from "vue";
import { getMemory } from "../scripts/util";
import { type_assembled_box, type_box } from "../types";
import { Add, Close as closeIcon, Delete as DEL } from "@vicons/carbon";

const props = defineProps<{
    data_id: number;
    all_boxes: type_assembled_box[];
}>();

const emits = defineEmits<{
    (event: "send", value: type_box): void;
    (event: "close"): void;
}>();

const is_show = ref(false);

const formRef = ref<FormInst | null>(null);

const all_folders = ref<type_box[]>([]);

const form = reactive({
    id: null,
    name: "",
    url: "",
    parent_id: null,
    is_folder: false,
});

const message = useMessage();

const rules = {
    name: {
        required: true,
        message: "表示する文字を入力してください。",
        trigger: ["input", "blur"],
        validator(rule: FormItemRule, value: string) {
            if (value.length === 0) {
                return new Error("名称を入力してください。");
            }
            if (unref(props.all_boxes).some((b) => b.name === value)) {
                return new Error("名称が他のボックスと重複しています。");
            }

            return true;
        },
    },
    url: {
        required: false,
        // message: "URLを入力してください。",
        trigger: ["input", "blur"],
        validator(rule: FormItemRule, value: string) {
            if(form.is_folder) return true;
            if(value.length === 0) {
                return new Error("URLwonyuuryokusitekudasai.");
            }
            const regex =
                /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;

            if (!regex.test(value)) {
                return new Error("URL形式が正しくありません。");
            }

            return true;
        },
    },
};

const title = computed(() => {
    if (props.data_id === 0) {
        return "ボックス作成";
    } else {
        return "ボックス編集";
    }
});

const select_options = computed(() => {
    return [
        {
            label: "階層作成する場合は親ボックスを入力してください。",
            value: "a",
            disabled: true,
        },
        ...all_folders.value
            .filter((b) => b.id !== form.id)
            .map((b) => {
                return {
                    label: String(b.name),
                    value: b.id,
                };
            }),
    ];
});

/**
 *  Methods ---------------------------------------------------------
 */

function send(e: MouseEvent) {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        if (errors) {
            message.warning("内容を確認してください。");
        } else {
            const value = formRef.value;

            emits("send", <any>unref(form));
        }
    });
}

function close() {
    emits("close");
}

onMounted(() => {
    is_show.value = true;
    all_folders.value = getMemory().filter((b: type_box) => b.is_folder);
});
</script>
<style lang="scss" scoped>
@use "../color.scss" as color;

.modal {
    width: 400px;
    padding: 1rem;

    .border-item {
        border-radius: 0.25rem;
        padding: 0.4rem;
        box-shadow: 0 0 2px 1px rgba($color: #fff, $alpha: 0.2);
    }
}
</style>
