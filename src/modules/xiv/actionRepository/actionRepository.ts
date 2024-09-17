import { JobGuideJson, Action } from '../actionData/actionDataTypes';
import { JobGuide } from '../actionData/actionData';

export function getActionInfo(job: keyof JobGuideJson, action: string): Action | undefined {
    // TODO: merge w/ effect processing & re-key for faster lookup
    return JobGuide[job].actions.find((a: Action) => a.name === action);
}

export function getJobActions(job: keyof JobGuideJson): Action[] {
    return JobGuide[job].actions;
}

export function getJobNames(): (keyof JobGuideJson)[] {
    const data: JobGuideJson = JobGuide;
    const outerCategories = Object.keys(data) as (keyof JobGuideJson)[];
    return outerCategories;
}
