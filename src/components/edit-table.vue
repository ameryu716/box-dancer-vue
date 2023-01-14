<template>
    <n-modal v-model:show="is_show" class="modal">
        <n-card
            style="width: 1000px; height: 600px"
            title="編集"
            :bordered="false"
            size="huge"
            role="dialog"
            aria-modal="true"
        >
            <template #header-extra>
                <n-button class="ms-auto" @click="close" strong secondary>
                    <n-icon size="24"><close-icon /></n-icon>
                </n-button>
            </template>
            <n-data-table :columns="columns" :data="data" :row-key="rowKey" />
            <template #footer>
                <div class="fl">
                    <n-button type="info" @click="addRow"
                        >増やす
                        <n-icon size="24">
                            <add />
                        </n-icon>
                    </n-button>

                    <n-button
                        strong
                        primary
                        class="ms-auto"
                        type="primary"
                        @click="enter"
                        >確定
                    </n-button>
                </div>
            </template>
        </n-card>
    </n-modal>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, onMounted, ref, unref } from "vue";
import {
    DataTableColumns,
    NButton,
    NIcon,
    NSelect,
    useDialog,
    useMessage,
} from "naive-ui";
import { type_box } from "../types";
import { getMemory, setMemory, niConfirm } from "../scripts/util";
import { Add, Close as closeIcon, Delete as DEL } from "@vicons/carbon";
import { NInput } from "naive-ui";

const emits = defineEmits<{
    (event: "close"): void;
}>();

const is_show = ref(false);

const data = ref<type_box[]>([]);

const dialog = useDialog();
const message = useMessage();

const select_options = computed(() => {
    return [
        {
            label: "親ID",
            value: "",
            disabled: true,
        },
        {
            label: "",
            value: null,
        },
        ...data.value.map((b) => {
            return {
                label: String(b.id),
                value: b.id,
            };
        }),
    ];
});

const columns: DataTableColumns<type_box> = [
    {
        title: "#",
        key: "id",
        width: "50",
    },
    {
        title: "親ID",
        key: "parent_id",
        width: "80",
        render(row, index) {
            return h(NSelect, {
                "modelValue:value": row.parent_id,
                options: select_options.value.filter((s) => s.value !== row.id),
                placeholder: "親ID",
                onUpdateValue(v) {
                    console.log(v);

                    row.parent_id = v;
                },
            });
        },
    },
    {
        width: "200",
        title: "名称",
        key: "name",
        render(row, index) {
            return h(NInput, {
                placeholder: "名称を入力...",
                value: row.name,
                onUpdateValue(v) {
                    row.name = v;
                },
            });
        },
    },
    {
        width: "350",
        title: "URL",
        key: "url",
        render(row, index) {
            return h(NInput, {
                placeholder: "URLを入力...",
                value: row.url,
                onUpdateValue(v) {
                    data.value[index].url = v;
                },
            });
        },
    },
    {
        width: "70",
        title: "子",
        key: "children",
        render(row, index) {
            return h(
                NButton,
                {
                    type: "info",
                    onClick() {
                        addChidren(row.id);
                    },
                },
                h(NIcon, null, { default: () => h(Add) })
            );
        },
    },
    {
        width: "70",
        title: "削除",
        key: "delete",
        render(row, index) {
            return h(
                NButton,
                {
                    type: "error",
                    onClick() {
                        deleteRow(data.value[index].id);
                    },
                },
                h(NIcon, null, { default: () => h(DEL) })
            );
        },
    },
];

function refresh() {
    data.value = getMemory();
}

const rowKey = (row: type_box) => {
    return Math.random().toString(32).substring(2);
};

/**
 * Computed ------------------------------------------------------
 */

const max_id = computed(() => {
    return Math.max(...data.value.map((d) => d.id), 0) + 1;
});

/**
 * Methods ------------------------------------------------------
 */

function addRow() {
    const max = unref(max_id);
    data.value.push({
        id: max,
        name: "",
        url: "",
        parent_id: null,
    });
}
function deleteRow(id: number) {
    const after = unref(data).filter((d) => d.id !== id);

    data.value = after;
}

function addChidren(id: number) {
    const max = unref(max_id);
    data.value.push({
        parent_id: id,
        id: max,
        name: "",
        url: "",
    });
}

function close() {
    emits("close");
}

async function enter() {
    await niConfirm(dialog, "info", "確定", "本当に保存しますか？").then(
        (r) => {
            setMemory(data.value);
            message.success("保存しました。");
        }
    );
}

onMounted(() => {
    refresh();
    is_show.value = true;
});
</script>
