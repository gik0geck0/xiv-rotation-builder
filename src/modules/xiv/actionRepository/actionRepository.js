import actionData from "xiv/actionData";

export function getActionInfo(job, action) {
    return Object.assign({name: action}, actionData[job][action]);
}