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

            <n-button
                strong
                quaternary
                class="ms-2"
                size="large"
                @click="openConfig"
            >
                <template #icon>
                    <n-icon size="28"><settings /></n-icon>
                </template>
            </n-button>
        </header>
        <main>
            <transition-group name="flip-list">
                <box
                    v-for="(b, index) in assembled_data"
                    :id="'box-' + b.id"
                    :name="b.name"
                    :url="b.url"
                    :is_folder="b.is_folder"
                    :is_open="b.is_open"
                    :color="index % 2 === 1 ? config.color : default_box_color"
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

            <config
                v-if="config_show"
                :boxes="link_boxes"
                @close="closeConfig"
            />
        </main>
    </div>
</template>
<script lang="ts" setup>
// Framework
import { computed, nextTick, onMounted, ref, unref } from "vue";
import { DataTable, Json, Settings } from "@vicons/carbon";
// Any
import {
    getMemory,
    createBox as create,
    initial_config,
    getConfig,
    message as use_message,
} from "../scripts/util";
// Type
import { type_box, type_assembled_box } from "../types";

// Component
import Box from "./Box.vue";
import CreationBox from "./CreationBox.vue";
import Modal from "./Modal.vue";
import editTable from "./edit-table.vue";
import JsonView from "./JsonView.vue";
import Config from "./Config.vue";
import { draw, add } from "../scripts/canvas/bubble";

const boxes = ref<type_assembled_box[]>([]);
const modal_show = ref(false);
const edit_table_show = ref(false);
const json_show = ref(false);
const config_show = ref(false);

const data_id = ref(0);
const json_data = ref("");

const default_box_color = ref("#00000099");
// "#f32f9399"
const config = ref(initial_config);

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

const link_boxes = computed(() => {
    return assembled_data.value.filter((b) => !b.is_folder);
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

function openConfig() {
    config_show.value = true;
}

function closeConfig() {
    config_show.value = false;
}

function applyConfig() {
    config.value = getConfig();
}

function shortCutSet() {
    config.value.short_cuts.forEach((s) => {
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey && s.key === e.key) {
                e.stopPropagation();
                e.preventDefault();
                const box_element = document.getElementById(`box-${s.box_id}`);
                if (box_element === null) {
                    use_message.warning("ショートカット起動に失敗しました。");
                    return;
                }
                console.log("r");
                const link_anchor = box_element.getElementsByTagName("a")[0];

                link_anchor.click();
            }
        });
    });
}

function createBox(value: type_box) {
    try {
        if (data_id.value === 0) {
            create(value);
        }
        use_message.success("作成しました。");
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
    applyConfig();
    refresh();
    shortCutSet();

    if (config.value.canvas_type === 1) {
        setInterval(() => {
            add();
        }, 2000);

        draw();
    }
});
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
