interface type_box {
    id: number,
    name: string,
    url: string,
    children: type_box[]
}

interface type_creation_box {
    name: string,
    url: string,
}

export {type_box,type_creation_box}