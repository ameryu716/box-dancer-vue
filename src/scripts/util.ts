import { useMessage } from "naive-ui";
import { type_box } from "../types";

const local_storage_key = import.meta.env.VITE_LOCAL_STORAGE_KEY;
const message = useMessage();

function getMemory() {
    const data = localStorage.getItem(local_storage_key);

    if (data === null) return [];

    return JSON.parse(data);
}

function setMemory(data: type_box[]) {
    const after = JSON.stringify(data);

    localStorage.setItem(local_storage_key, after);
}

function createBox(object_data: type_box) {
    const data = getMemory();

    const max_id = Math.max(...data.map((d: type_box) => d.id), 0) + 1;
    object_data.id = max_id;

    data.push(object_data);

    const to_send = JSON.stringify(data);

    localStorage.setItem(local_storage_key, to_send);
}

type confirm_type = "info" | "warn" | "error" | "success";

async function niConfirm(
    dialog: any,
    type: confirm_type,
    title = "",
    message = ""
): Promise<void> {
    return new Promise((resolve, reject) => {
        const option = {
            title: "確定",
            content: "本当に保存しますか？",
            positiveText: "確定",
            negativeText: "キャンセル",
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
                dialog.warn(option);
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
    } else {
        throw new Error("コピーできませんでした。");
    }
}

export { local_storage_key, createBox, getMemory, setMemory, niConfirm, copy };
