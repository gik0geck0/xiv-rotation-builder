export default {
    generationDate: "5/15/2024 8:29:00 -0600"
};
import jobGuideJson from "./jobGuide";
import { camelize } from "xiv/utils";
import { parseEffect } from './parseEffect'

// insert action IDs
for (const jobName in jobGuideJson) {
    const jobActions = jobGuideJson[jobName].actions;
    for (const action of jobActions) {
        action.id = camelize(action.name);
        action.location = 'tray';
        action.description = `Name: ${action.name}    
        Level Req.: ${action.level}    
        Type: ${action.type}     
        Cast Time: ${action.cast}      
        Recast Time: ${action.recast}          
        Cost: ${action.cost}      
        Effect: ${action.effect}`
        parseEffect(action)
    }
}

export const JobGuide = jobGuideJson;