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

        // parseFloat of cast, recast, duration, potency, comboPotency, comboBonus, and grants if action has them
        if(action.cast) {
            const parsedCast = parseFloat(action.cast);
            action.castNumeric = !isNaN(parsedCast) ? parsedCast : 0;
        }

        if(action.recast) {
            const parsedRecast = parseFloat(action.recast);
            action.recastNumeric = !isNaN(parsedRecast) ? parsedRecast : 0;
        }

        if(action.duration) {
            const parsedDuration = parseFloat(action.duration);
            action.durationNumeric = !isNaN(parsedDuration) ? parsedDuration : 0;
        }

        if(action.potency) {
            const parsedPotency = parseFloat(action.potency);
            action.potencyNumeric = !isNaN(parsedPotency) ? parsedPotency : 0;
        }

        if(action.comboPotency) {
            const parsedComboPotency = parseFloat(action.comboPotency);
            action.comboPotencyNumeric = !isNaN(parsedComboPotency) ? parsedComboPotency : 0;
        }

        if(action.comboBonus) {
            const comboBonusNumeric = {};

            for(const key in action.comboBonus) {
                const value = action.comboBonus[key];
                const parsedValue = parseFloat(value);

                if(!isNaN(parsedValue)) {
                    comboBonusNumeric[key] = parsedValue;
                } else {
                    comboBonusNumeric[key] = 0;
                }
            }

            action.comboBonusNumeric = comboBonusNumeric;
        }

        if(action.grants) {
            const grantsNumeric = {};

            for(const key in action.grants) {
                const value = action.grants[key];
                const parsedValue = parseFloat(value);

                if(!isNaN(parsedValue)) {
                    grantsNumeric[key] = parsedValue;
                } else {
                    grantsNumeric[key] = 0;
                }
            }

            action.grantsNumeric = grantsNumeric;
        }

        // Set boolean flags for Action type and cast time
        action.isInstant = action.cast === 'Instant';
        action.isAbility = action.type === 'Ability';
        action.isSpell = action.type === 'Spell';
        action.isWeaponskill = action.type === 'Weaponskill';
    }
}

export const JobGuide: JobGuideJson = jobGuideJson;
