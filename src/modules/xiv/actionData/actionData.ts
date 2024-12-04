import { JobGuideJson } from './actionDataTypes'; // Importing types
import jobGuideJson from './jobGuide'; // Assuming jobGuideJson is already typed in jobGuide

// re-export for consumers
export type { Action, Buff, JobGuideJson } from './actionDataTypes';

export default {
    generationDate: '5/15/2024 8:29:00 -0600'
};

export const JobGuide: JobGuideJson = jobGuideJson;
