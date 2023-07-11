import { useMessage } from "naive-ui";
import { type_box, type_config } from "../types";
import {
    createDiscreteApi,
    ConfigProviderProps,
    darkTheme,
    lightTheme,
} from "naive-ui";

const { message, notification, dialog, loadingBar } = createDiscreteApi([
    "message",
    "dialog",
    "notification",
    "loadingBar",
]);

const local_storage_key_boxes = import.meta.env.VITE_LOCAL_STORAGE_KEY_BOXES;
const local_storage_key_config = import.meta.env.VITE_LOCAL_STORAGE_KEY_CONFIG;

function getMemory() {
    const data = localStorage.getItem(local_storage_key_boxes);

    if (data === null) return [];

    return JSON.parse(data);
}

async function setMemory(data: type_box[]) {
    const after = JSON.stringify(data);

    localStorage.setItem(local_storage_key_boxes, after);
    message.success("保存しました。");

    await timer(2000);
    location.reload();
}

async function setMemoryFromJson(json: string) {
    localStorage.setItem(local_storage_key_boxes, json);
    message.success("保存しました。");

    await timer(2000);
    location.reload();
}

function createBox(object_data: type_box) {
    const data = getMemory();

    const max_id = Math.max(...data.map((d: type_box) => d.id), 0) + 1;
    object_data.id = max_id;

    data.push(object_data);

    const to_send = JSON.stringify(data);

    localStorage.setItem(local_storage_key_boxes, to_send);
    message.success("作成しました。");
}

const initial_config: type_config = {
    color: "#f32f9399",
    short_cuts: [],
    canvas_type: null,
};

function getConfig() {
    const data = localStorage.getItem(local_storage_key_config);

    if (data === null) return initial_config;

    return { ...initial_config, ...JSON.parse(data) };
}

function setConfig(config: type_config) {
    const data = JSON.stringify(config);

    localStorage.setItem(local_storage_key_config, data);
    message.success("保存しました。");
}

type confirm_type = "info" | "warn" | "error" | "success";

async function niConfirm(
    type: confirm_type,
    title = "",
    message = "",
    confirm_text = "確定",
    cancel_text = "やめる"
): Promise<void> {
    return new Promise((resolve, reject) => {
        const option = {
            title: title,
            content: message,
            positiveText: confirm_text,
            negativeText: cancel_text,
            onPositiveClick: () => {
                resolve();
            },
            onNegativeClick: () => {
                reject();
            },
        };

        switch (type) {
            case "info":
                dialog.info(option);
                break;
            case "warn":
                dialog.warning(option);
                break;
            case "error":
                dialog.error(option);
                break;
            case "success":
                dialog.success(option);
                break;
        }
    });
}

function copy(text: string | undefined | null) {
    if (text === undefined || text === null) return;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        message.info("コピーしました。");
    } else {
        throw new Error("コピーできませんでした。");
    }
}

async function timer(duration: number = 1000): Promise<void> {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, duration);
    });
}

export {
    local_storage_key_boxes,
    createBox,
    getMemory,
    setMemory,
    niConfirm,
    copy,
    setMemoryFromJson,
    getConfig,
    setConfig,
    initial_config,
    message,
    timer,
};
