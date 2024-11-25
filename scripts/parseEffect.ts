import type { Action } from '../src/modules/xiv/actionData/actionDataTypes';

export function parseEffect(action: Action): void {
    //Split the effect by line and then each line by spaces
    if (action.effect.includes('<BR>')) {
        action.effect = action.effect.replace('<BR>', '<br>');
    }

    let splitEffect: string[][] = action.effect.split('<br>').map(line => line.split(' '));

    //Go through every line of the effect
    for (let i = 0; i < splitEffect.length; i++) {
        let line = splitEffect[i];
        if (
            line.includes('potency') &&
            !line.includes('Increases') &&
            !line.includes('Additional')
        ) {
            if (!(line[line.indexOf('potency') + 2] === undefined)) {
                action.potency = line[line.indexOf('potency') + 2].replace(
                    '.',
                    ''
                );
            }
        }

        if (line.includes('Duration:')) {
            action.duration = line[line.indexOf('Duration:') + 1].replace(
                's',
                ''
            );
        }

        //Parse combo things
        if (line.includes('Combo')) {
            if (line.includes('Action:')) {
                //Add the entire combo skill to the comboAction
                var actionName = '';
                for (
                    let k = line.indexOf('Action:') + 1;
                    k < line.length;
                    k++
                ) {
                    actionName += line[k];
                    if (k < line.length - 1) {
                        actionName += ' ';
                    }
                }
                action.comboAction = actionName;
            }

            if (line.includes('Potency:')) {
                action.comboPotency = line[line.indexOf('Potency:') + 1];
            }

            if (line.includes('Bonus:')) {
                //Parse the effect of the bonus
                let bonusEffect: string[] = [];
                for (let k = line.indexOf('Bonus:') + 1; k < line.length; k++) {
                    bonusEffect.push(line[k]);
                }
                //Check for buff/effect granting INSIDE COMBO BONUS
                if (bonusEffect.includes('Grants')) {
                    //Buffs with stacks INSIDE COMBO BONUS
                    if (bonusEffect.includes('stacks')) {
                        let buffName = '';
                        for (
                            let j = bonusEffect.indexOf('stacks') + 2;
                            j < bonusEffect.length;
                            j++
                        ) {
                            if (bonusEffect[j].includes(',')) {
                                buffName += bonusEffect[j]
                                    .replace(',', '')
                                    .toLowerCase();
                                break;
                            }
                            buffName += bonusEffect[j].toLowerCase();
                        }
                        action.comboBonus = {
                            ...action.comboBonus,
                            [buffName]:
                                bonusEffect[bonusEffect.indexOf('Grants') + 1]
                        };
                    }
                    //Perecent damage increase buffs INSIDE COMBO BONUS
                    else if (
                        bonusEffect.includes('%') &&
                        bonusEffect.includes('damage')
                    ) {
                        let buffName = '';
                        let m = bonusEffect.indexOf('Grants');
                        while (!bonusEffect[m].includes(',')) {
                            buffName += bonusEffect[m].toLowerCase();
                            m++;
                        }
                        buffName += bonusEffect[m + 1]
                            .replace(',', '')
                            .toLowerCase();
                        action.comboBonus = {
                            ...action.comboBonus,
                            [buffName]: 
                                1 + parseFloat(bonusEffect[bonusEffect.indexOf('dealt') + 2].replace('%', '')) / 100
                        };
                            
                    }
                    //General buffs INSIDE COMBO BONUS
                    else {
                        let buffName = '';
                        for (
                            let j = bonusEffect.indexOf('Grants') + 1;
                            j < bonusEffect.length;
                            j++
                        ) {
                            if (bonusEffect[j].includes(',')) {
                                buffName += bonusEffect[j]
                                    .replace(',', '')
                                    .toLowerCase();
                                break;
                            }
                            buffName += bonusEffect[j].toLowerCase();
                        }
                        action.comboBonus = {
                            ...action.comboBonus,
                            [buffName]: 1
                        };
                    }
                }

                //Check for gauge increases INSIDE COMBO BONUS
                if (bonusEffect.includes('Gauge')) {
                    let gaugeName = '';
                    for (
                        let j = bonusEffect.indexOf('Increases') + 1;
                        j < bonusEffect.indexOf('Gauge');
                        j++
                    ) {
                        gaugeName += bonusEffect[j];
                    }
                    action.comboBonus = {
                        ...action.comboBonus,
                        [gaugeName]:
                            bonusEffect[bonusEffect.indexOf('Gauge') + 2]
                    };
                }
            }
        }

        //Additional effect stuff
        if (line.includes('Additional')) {
            if (line.includes('Restores') && line.includes('MP')) {
                //player.changeMP(null) //Stretch goal to have the MP change per skill
            }

            if (
                line.includes('Damage') &&
                line.includes('over') &&
                line.includes('time')
            ) {
                i++;
                action.durationPotency = Math.floor(parseFloat(splitEffect[i][1]) / 3); //per 3 seconds (time/3 - 1 potency guaranteed)
            }
        }

        //Altered Potencies Check
        if (
            line.includes('Potency:') &&
            !line.includes('Cure') &&
            !line.includes('Combo')
        ) {
            var potencyName = '';
            for (let j = 0; j < line.indexOf('Potency:'); j++) {
                potencyName += line[j].toLowerCase();
            }
            action[potencyName] = parseFloat(line[line.indexOf('Potency:') + 1].replace(',', ''));
        }

        //Checks for buff/effect granting
        if (
            line.includes('Grants') &&
            !line.includes('Combo') &&
            !line.includes('to')
        ) {
            //Buffs with stack component
            if (line.includes('stacks')) {
                var buffName = '';
                for (let j = line.indexOf('stacks') + 2; j < line.length; j++) {
                    if (line[j].includes(',')) {
                        buffName += line[j].replace(',', '').toLowerCase();
                        break;
                    }
                    buffName += line[j].toLowerCase();
                }
                action.grants = {
                    ...action.grants,
                    [buffName]: line[line.indexOf('Grants') + 1]
                };
            }
            //Percentage increase in damage buffs
            else if (line.includes('%') && line.includes('damage')) {
                let buffName = '';
                let m = line.indexOf('Grants');
                while (!line[m].includes(',')) {
                    buffName += line[m].toLowerCase();
                    m++;
                }
                buffName += line[m + 1].replace(',', '').toLowerCase();
                action.grants = {
                    ...action.grants,
                    [buffName]:
                        1 +
                        parseFloat(line[line.indexOf('dealt') + 2].replace('%', '')) / 100
                };
            }
            //General types of buffs
            else {
                let buffName = '';
                for (let j = line.indexOf('Grants') + 1; j < line.length; j++) {
                    if (line[j].includes(',')) {
                        buffName += line[j].replace(',', '').toLowerCase();
                        break;
                    }
                    buffName += line[j].toLowerCase();
                }
                action.grants = { ...action.grants, [buffName]: 1 };
            }
        }

        //Checks for buff/effect requirement to use
        if (
            line.includes('executed') &&
            line.includes('under') &&
            line.includes('effect')
        ) {
            var requirement = '';
            for (let j = line.indexOf('of') + 1; j < line.length; j++) {
                var tempWord = line[j];
                if (tempWord.includes('.')) {
                    tempWord = tempWord.replace('.', '');
                    requirement += tempWord;
                    break;
                }
                requirement += tempWord;
            }
            action.buffRequirement = requirement
                .replace(/\s+/g, '')
                .toLowerCase();
        }

        //Gauge Cost check
        if (line.includes('Gauge') && !line.includes('Increases')) {
            let gaugeName = '';
            for (let j = 0; j < line.indexOf('Gauge'); j++) {
                gaugeName += line[j];
            }
            action[gaugeName] = -line[line.indexOf('Cost:') + 1];
        } else if (line.includes('Gauge') && line.includes('Increases')) {
            let gaugeName = '';
            for (
                let j = line.indexOf('Increases') + 1;
                j < line.indexOf('Gauge');
                j++
            ) {
                gaugeName += line[j];
            }
            action[gaugeName] = line[line.indexOf('Gauge') + 2].replace(
                '.',
                ''
            );
        }

        //Percentage increase in damage check
        if (
            line.includes('Increases') &&
            line.includes('damage') &&
            line.includes('dealt')
        ) {
            var buffVal =
                1 + parseFloat(line[line.indexOf('dealt') + 2].replace('%', '')) / 100;
            if (!isNaN(buffVal)) {
                action.damageBuff = buffVal;
            }
        } 
        
        // Parse transformsFrom logic
        if (line.includes('changes') && line.includes('to')) {
            const fullLine = splitEffect[i].join(' ');
            if (fullLine.includes('※')) { // Process only if "※" exists
                let beforeChanges = fullLine.split('changes to')[0].trim();
                beforeChanges = beforeChanges.replace('※', '').trim(); // Remove "※"
                action.transformsFrom = beforeChanges;
            }
        }
    }
}
