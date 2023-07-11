<template>
    <n-drawer v-model:show="is_show" :width="480" :on-after-leave="close">
        <n-drawer-content :native-scrollbar="false" :width="996" closable>
            <template #header> 設定 </template>
            <div class="drawer-content">
                <!-- カラー -->
                <div class="fl mb-3 drawer-row">
                    <n-h3 class="m-0 label">カラー</n-h3>
                    <n-color-picker
                        style="width: 120px"
                        v-model:value="config.color"
                        :swatches="[
                            '#FFFFFF',
                            '#18A058',
                            '#2080F0',
                            '#F0A020',
                            'rgba(208, 48, 80, 1)',
                        ]"
                    >
                        <template #label>{{ config.color }}</template>
                    </n-color-picker>
                </div>
                <!-- キャンバス -->
                <div class="fl mb-3 drawer-row">
                    <n-h3 class="m-0 label">アニメーション背景</n-h3>
                    <div style="min-width: 200px">
                        <n-select
                            v-model:value="config.canvas_type"
                            :options="canvasSelection"
                        ></n-select>
                    </div>
                </div>
                <!-- ショートカット -->
                <div class="fl mb-3 drawer-row">
                    <n-h3 class="m-0 label">ショートカット</n-h3>
                    <n-button @click="plusShortCut">
                        <n-icon :size="20">
                            <add />
                        </n-icon>
                    </n-button>
                </div>
                <div>
                    <n-table :bordered="false" :single-line="false">
                        <thead>
                            <tr>
                                <th style="width: 200px">ボックス</th>
                                <th>キー</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="s in config.short_cuts">
                                <td>
                                    <div>
                                        <n-select
                                            v-model:value="s.box_id"
                                            :options="select_options"
                                            key="id"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <n-input
                                            v-model:value="s.key"
                                            type="text"
                                            placeholder="A"
                                            maxlength="1"
                                            show-count
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <n-button
                                            type="error"
                                            quaternary
                                            circle
                                            @click="deleteShortCut(s.key)"
                                        >
                                            <n-icon :size="20">
                                                <delete />
                                            </n-icon>
                                        </n-button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </n-table>
                </div>
            </div>
            <template #footer>
                <n-button @click="saveConfig" strong secondary type="info"
                    >確定</n-button
                >
            </template>
        </n-drawer-content>
    </n-drawer>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, unref } from "vue";
import {
    setConfig as save,
    getConfig,
    initial_config,
    message as use_message,
    timer,
} from "../scripts/util";
import { type_config, type_assembled_box } from "../types";
import { AddAlt, Add, Delete } from "@vicons/carbon";

const props = defineProps<{
    boxes: type_assembled_box[];
}>();

const emits = defineEmits<{
    (event: "close"): void;
}>();

/**
 * Data ----------------------------------------------------------
 */

const config = ref<type_config>({
    ...initial_config,
});
const is_show = ref(false);

/**
 * Computed -------------------------------------------------------
 */

const select_options = computed(() => {
    return props.boxes.map((b) => {
        console.log(b.id);

        return {
            label: b.name,
            value: b.id,
        };
    });
});

const canvasSelection = computed(() => {
    return [
        {
            label: "設定なし",
            value: null,
        },
        {
            label: "Bubble",
            value: 1,
        },
        {
            label: "StarNight",
            value: 2,
        },
    ];
});

/**
 * Methods --------------------------------------------------
 */

function close() {
    emits("close");
}

async function saveConfig() {
    if (
        config.value.short_cuts.every((s) => {
            return (
                s.key === null ||
                config.value.short_cuts.filter((d) => d.key === s.key)
                    .length === 1
            );
        })
    ) {
        save(config.value);
        await timer(500);
        location.reload();
    } else {
        use_message.warning("ショートカットに重複したキーは登録できません。");
    }
}

function plusShortCut() {
    if (props.boxes.length === 0) {
        use_message.error("対象のボックスがありません。");
        return;
    }
    config.value.short_cuts.push({
        key: "",
        box_id: null,
    });
}

function deleteShortCut(key: string) {
    config.value.short_cuts = config.value.short_cuts.filter(
        (c) => c.key !== key
    );
}

onMounted(() => {
    is_show.value = true;
    config.value = getConfig();
});
</script>
<style lang="scss">
.drawer-content {
    .drawer-row {
        .label {
            width: 150px;
        }
    }
}
</style>
