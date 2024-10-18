#!/usr/bin/env node

import XIVFinal from './XIVFinal.json' with { type: 'json' };
import jobStaticData from './jobStaticData.json' with { type: 'json' };
import fs from 'fs';
import { mergeDeep } from './utils.js';
import { camelize } from '../src/modules/xiv/utils/utils.ts';
import { parseEffect } from './parseEffect.ts';
import type { Action } from '../src/modules/xiv/actionData/actionData.ts';

// merge
const combined = mergeDeep(jobStaticData, XIVFinal);

// insert action IDs and pre-process actions/effects
for (const jobName in XIVFinal) {
    const jobActions: Action[] = XIVFinal[jobName].actions;
    if(Array.isArray(jobActions)) {
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
    } else {
        console.error(`No valid actions found for job: ${jobName}`);
    }
}

// create output file
const fileName = '../src/modules/xiv/actionData/jobGuide.js';
// prefix with export clause
fs.writeFileSync(fileName, 'export default ');

// append formatted data (basically json except for the above)
fs.writeFileSync(fileName, JSON.stringify(combined, null, 4), { flag: 'a' });
