<template>
    <div class="wrapper">
        <header class="fl">
            <div>
                <h1 class="mb-2">Box Dancer</h1>
            </div>

            <n-button
                strong
                secondary
                type="primary"
                class="ms-auto"
                size="large"
                @click="openEditTable"
            >
                <template #icon>
                    <n-icon size="28"><data-table /></n-icon>
                </template>
            </n-button>

            <n-button
                strong
                secondary
                type="primary"
                class="ms-2"
                size="large"
                @click="openJson"
            >
                <template #icon>
                    <n-icon size="28"><json /></n-icon>
                </template>
            </n-button>

            <n-color-picker
                class="ms-2"
                style="width: 60px"
                v-model:value="set_color"
                :swatches="[
                    '#FFFFFF',
                    '#18A058',
                    '#2080F0',
                    '#F0A020',
                    'rgba(208, 48, 80, 1)',
                ]"
            >
                <template #label></template>
            </n-color-picker>
        </header>
        <main>
            <transition-group name="flip-list">
                <box
                    v-for="(b, index) in assembled_data"
                    :name="b.name"
                    :url="b.url"
                    :is_folder="b.is_folder"
                    :is_open="b.is_open"
                    :color="index % 2 === 1 ? set_color : default_box_color"
                    v-show="!b.hide"
                    @folder-open-toggle="folderOpenToggle(b.id)"
                />
            </transition-group>

            <creation-box @create-modal-open="openModal(0)" />
            <modal
                v-if="modal_show"
                :data_id="data_id"
                :all_boxes="boxes"
                @send="createBox"
                @close="closeModal"
            />
            <edit-table v-if="edit_table_show" @close="closeEditTable" />

            <json-view v-if="json_show" :json="json_data" @close="closeJSON" />
        </main>
    </div>
</template>
<script lang="ts" setup>
// Framework
import { computed, nextTick, onMounted, ref, unref } from "vue";
import { DataTable, Json } from "@vicons/carbon";
import { useMessage } from "naive-ui";
// Any
import {
    local_storage_key,
    getMemory,
    createBox as create,
} from "../scripts/util";
// Type
import { type_box, type_assembled_box } from "../types";

// Component
import Box from "./Box.vue";
import CreationBox from "./CreationBox.vue";
import Modal from "./Modal.vue";
import editTable from "./edit-table.vue";
import JsonView from "./JsonView.vue";
import { draw, add } from "../scripts/canvas/bubble";

const boxes = ref<type_assembled_box[]>([]);
const modal_show = ref(false);
const edit_table_show = ref(false);
const json_show = ref(false);
const data_id = ref(0);
const json_data = ref("");
const message = useMessage();

const default_box_color = ref("#00000099");
// "#f32f9399"
const set_color = ref("#f32f9399");

/**
 * Computed ---------------------------------------------------------
 */

const assembled_data = computed(() => {
    const _boxes: type_assembled_box[] = JSON.parse(
        JSON.stringify(
            [...unref(boxes)].map((b) => {
                return {
                    ...b,
                };
            })
        )
    );

    console.log(_boxes.length);

    const assembled = [..._boxes];

    return assembled;
});

/**
 * Methods ----------------------------------------------------------
 */

function refresh() {
    boxes.value = getMemory().map((b: type_assembled_box) => {
        b.hide = b.parent_id !== null; //子
        b.is_open = false; //フォルダー
        return b;
    });
}

function openModal(id: number) {
    data_id.value = id;
    modal_show.value = true;
}

function closeModal() {
    modal_show.value = false;
}

function openEditTable() {
    edit_table_show.value = true;
}

function closeEditTable() {
    edit_table_show.value = false;
}

function openJson() {
    json_data.value = JSON.stringify(boxes.value);
    json_show.value = true;
}

function closeJSON() {
    json_show.value = false;
}

function createBox(value: type_box) {
    try {
        if (data_id.value === 0) {
            create(value);
        }
        message.success("作成しました。");
    } finally {
        closeModal();
        refresh();
    }
}

function folderOpenToggle(id: number) {
    boxes.value
        .filter((b) => b.id === id || b.parent_id === id)
        .forEach((b) => {
            if (b.id === id) {
                b.is_open = !b.is_open;
            } else {
                b.hide = !b.hide;
            }
        });
}

onMounted(() => {
    refresh();
});

setInterval(() => {
    add();
}, 2000);

draw();
</script>
<style lang="scss">
@use "../color.scss" as color;
.wrapper {
    height: 100vh;
    width: 100vw;
    padding: 1rem 2rem;
    box-sizing: border-box;

    header {
        height: 10%;
        border-bottom: solid 1px color.$thin;
        margin-bottom: 0.5rem;
        @media (prefers-color-scheme: dark) {
            border-color: color.$dark;
        }
        h1 {
            margin: 0 0 0.5rem;
        }
    }
    main {
        height: 85%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        gap: 1.5rem 3rem;
        align-content: start;
    }
}

.flip-list-move {
    transition: transform 0.8s ease;
}
</style>
