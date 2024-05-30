import jobGuideJson from "./jobGuide";
import { camelize } from "xiv/utils";

// insert action IDs
for (const jobName in jobGuideJson) {
    const jobActions = jobGuideJson[jobName].actions;
    for (const action of jobActions) {
        action.id = camelize(action.name);
    }
}

export const JobGuide = jobGuideJson;