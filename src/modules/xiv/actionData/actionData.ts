import { JobGuideJson, Action } from './actionDataTypes'; // Importing types
import { camelize } from 'xiv/utils';
import { parseEffect } from './parseEffect';
import jobGuideJson from './jobGuide'; // Assuming jobGuideJson is already typed in jobGuide

// re-export for consumers
export type { Action, JobGuideJson } from './actionDataTypes';

export default {
    generationDate: '5/15/2024 8:29:00 -0600'
};

// insert action IDs
for (const jobName in jobGuideJson) {
    const jobActions: Action[] = jobGuideJson[jobName].actions;
    for (const action of jobActions) {
        action.id = camelize(action.name);
        action.location = 'tray';
        action.errorMessage = '';
        action.description = `Name: ${action.name}    
        Level Req.: ${action.level}    
        Type: ${action.type}     
        Cast Time: ${action.cast}      
        Recast Time: ${action.recast}          
        Cost: ${action.cost}      
        Effect: ${action.effect}`;
        parseEffect(action);
    }
}

export const JobGuide: JobGuideJson = jobGuideJson;
