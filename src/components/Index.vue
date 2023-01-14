<template>
    <div class="wrapper">
        <header class="fl">
            <div>
                <h1 class="mb-2">Box Dancer</h1>
                <n-breadcrumb>
                    <n-breadcrumb-item> Home</n-breadcrumb-item>
                    <!-- <n-icon :component="ChevronRight" /> -->
                    <!-- <n-breadcrumb-item> Account</n-breadcrumb-item> -->
                </n-breadcrumb>
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

            <n-button strong secondary type="primary" class="ms-2" size="large">
                <template #icon>
                    <n-icon size="28"><json /></n-icon>
                </template>
            </n-button>
        </header>
        <main>
            <box
                v-for="b in boxes"
                :name="b.name"
                :url="b.url"
                @view-modal-open="openModal(b.id)"
            />
            <creation-box @create-modal-open="openModal(0)" />
            <modal v-if="modal_show" :data_id="data_id" @send="createBox" />
            <edit-table v-if="edit_table_show" @close="closeEditTable" />
        </main>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
    local_storage_key,
    getMemory,
    createBox as create,
} from "../scripts/util";
import { type_box } from "../types";
import Box from "./Box.vue";
import CreationBox from "./CreationBox.vue";
import Modal from "./Modal.vue";
import { DataTable, Json } from "@vicons/carbon";
import editTable from "./edit-table.vue";

const boxes = ref<type_box[]>([]);
const modal_show = ref(false);
const edit_table_show = ref(false);
const data_id = ref(0);

function refresh() {
    boxes.value = getMemory();
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

function createBox(value: type_box) {
    if (data_id.value === 0) {
        create(value);
    } else {
        console.log("edit");
        console.log(value);
    }
    closeModal();
    refresh();
}

onMounted(() => {
    refresh();
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
        gap: 1rem;
    }
}
</style>
