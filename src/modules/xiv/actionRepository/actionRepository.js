import { JobGuide } from 'xiv/actionData';

export function getActionInfo(job, action) {
    // TODO: merge w/ effect processing & re-key for faster lookup
    return JobGuide[job].actions.find((a) => a.name === action);
}

export function getJobActions(job) {
    return JobGuide[job].actions;
}

export function getJobNames() {
    const data = JobGuide;
    const outerCatergories = Object.keys(data);
    return outerCatergories;
}
