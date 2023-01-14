<template>
    <n-modal v-model:show="is_show" class="modal">
        <div>
            <h2>{{ title }}</h2>
            <n-form
                ref="formRef"
                :label-width="80"
                :model="form"
                :rules="rules"
                size="large"
            >
                <n-form-item label="テキスト" path="user.text">
                    <n-input v-model:value="form.text" placeholder="Goog..." />
                </n-form-item>
                <n-form-item label="URL" path="user.url">
                    <n-input
                        v-model:value="form.url"
                        placeholder="https://a..."
                    />
                </n-form-item>
                <n-form-item>
                    <n-button @click="send">送信</n-button>
                </n-form-item>
            </n-form>
        </div>
    </n-modal>
</template>
<script lang="ts" setup>
import { FormInst, useMessage } from "naive-ui";
import { computed, onMounted, reactive, ref, unref } from "vue";
import { getMemory } from "../scripts/util";
import { type_box } from "../types";

const props = defineProps<{
    data_id: number;
}>();

const emits = defineEmits<{
    (event: "send", value: type_box): void;
}>();

const is_show = ref(false);

const formRef = ref<FormInst | null>(null);

const form = reactive({
    id: null,
    text: "",
    url: "",
});

const message = useMessage();

const rules = {
    text: {
        required: true,
        message: "表示する文字を入力してください。",
        trigger: ["input", "blur"],
    },
    url: {
        required: true,
        message: "URLを入力してください。",
        trigger: ["input", "blur"],
    },
};

const title = computed(() => {
    if (props.data_id === 0) {
        return "ボックス作成";
    } else {
        return "ボックス編集";
    }
});

function send(e: MouseEvent) {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        console.log(errors);

        if (errors) {
            console.log(errors);
            message.error("Invalid");
        } else {
            const value = formRef.value;

            console.log(value);
            emits("send", unref(form));

            message.success("Valid");
        }
    });
}

onMounted(() => {
    // if (props.data_id !== null) {
    //     const data = getMemory();
    //     const view_data = data.filter((d: type_box) => d.id === props.data_id);

    //     for (const o in form) {
    //         form[o] = view_data[o];
    //     }
    // }

    is_show.value = true;
});
</script>
<style lang="scss">
@use "../color.scss" as color;

.modal {
    width: 400px;
    padding: 1rem;
}
</style>
