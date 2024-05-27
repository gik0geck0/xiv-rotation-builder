import { JobGuide } from "xiv/actionData";

export function getActionInfo(job, action) {
    // TODO: merge w/ effect processing & re-key for faster lookup
    return JobGuide[job].actions.find((a) => a.name === action);
}