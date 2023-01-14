interface type_box {
	id: number;
	name: string;
	url: string;
	parent_id: null | number;
}

interface type_creation_box {
	parent_id: null | number;
	name: string;
	url: string;
}

export { type_box, type_creation_box };
