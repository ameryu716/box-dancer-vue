interface type_box {
    id: number;
    name: string;
    url: string;
    parent_id: null | number;
    is_folder: boolean;
}

interface type_creation_box {
    parent_id: null | number;
    name: string;
    url: string;
    is_folder: boolean;
}

interface type_assembled_box {
    id: number;
    name: string;
    url: string;
    parent_id: null | number;
    is_open: boolean;
    is_folder: boolean;
    hide: boolean;
    sort_id?: number;
}

interface type_config {
    color: string;
    short_cuts: type_shortcut_config[];
    canvas_type: null | number;
}

interface type_shortcut_config {
    key: string;
    box_id: null | number;
}

export { type_box, type_creation_box, type_assembled_box, type_config };
