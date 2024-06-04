export function parseEffect(action){
    //Split the effect by line and then each line by spaces
    if ((action.effect).includes("<BR>")){
        action.effect = (action.effect).replace('<BR>', '<br>')
    }
    let splitEffect = (action.effect).split("<br>")

    for (let i = 0; i < splitEffect.length; i++){
        splitEffect[i] = splitEffect[i].split(" ")
    }

    //Go through every line of the effect
    for (let i = 0; i < splitEffect.length; i++){
        let line = splitEffect[i];

        if (line.includes('potency') && !(line.includes('Increases'))){
            if (!((line[line.indexOf('potency') + 2]) === undefined)){
                action.potency = ((line[line.indexOf('potency') + 2]).replace('.',''))
            }
        }

        if (line.includes('Duration:')){
            action.duration = (line[line.indexOf('Duration:') + 1].replace('s', ''))
        }

        //Parse combo things
        if (line.includes('Combo')){
            if (line.includes('Action:')){
                //Add the entire combo skill to the comboAction
                var actionName = ''
                for (let k = line.indexOf('Action:') + 1; k < line.length; k++){
                    actionName += line[k]
                    if (k < line.length - 1){
                        actionName += ' '
                    }
                }
                action.comboAction = actionName
            }

            if (line.includes('Potency:')){
                action.comboPotency = (line[line.indexOf('Potency:') + 1])
            }
            
            if (line.includes('Bonus:')){
                //Parse the effect of the bonus
                var bonusEffect = []
                for (let k = line.indexOf('Bonus:') + 1; k < line.length; k++){
                    bonusEffect.push(line[k])
                }
                //Check for buff/effect granting INSIDE COMBO BONUS
                if (bonusEffect.includes('Grants')){
                    //Buffs with stacks INSIDE COMBO BONUS
                    if(bonusEffect.includes('stacks')){
                        let buffName = ''
                        for (let j = bonusEffect.indexOf('stacks') + 2; j < bonusEffect.length; j++){
                            if (bonusEffect[j].includes(',')){
                                buffName += (bonusEffect[j].replace(',','')).toLowerCase()
                                break;
                            }
                            buffName += bonusEffect[j].toLowerCase()
                        }
                        action.comboBonus = {...action.comboBonus , [buffName] : bonusEffect[bonusEffect.indexOf('Grants') + 1]}
                    }
                    //Perecent damage increase buffs INSIDE COMBO BONUS
                    else if (bonusEffect.includes('%') && bonusEffect.includes('damage')){
                        let buffName = ''
                        var m = bonusEffect.indexOf('Grants')
                        while (!(bonusEffect[m].includes(','))){
                            buffName += bonusEffect[m].toLowerCase()
                            m++
                        }
                        buffName += (bonusEffect[m + 1].replace(',','')).toLowerCase()
                        action.comboBonus = {...action.comboBonus , [buffName] : (1 + ((bonusEffect[bonusEffect.indexOf('dealt') + 2].replace('%',''))/100))}
                    }
                    //General buffs INSIDE COMBO BONUS
                    else{
                        let buffName = ''
                        for (let j = bonusEffect.indexOf('Grants') + 1; j < bonusEffect.length; j++){
                            if (bonusEffect[j].includes(',')){
                                buffName += (bonusEffect[j].replace(',','')).toLowerCase()
                                break;
                            }
                            buffName += bonusEffect[j].toLowerCase()
                        }
                        action.comboBonus = {...action.comboBonus , [buffName] : -1}
                    }
                }

                //Check for gauge increases INSIDE COMBO BONUS
                if (bonusEffect.includes('Gauge')){
                    var gaugeName = ''
                    for (let j = bonusEffect.indexOf('Increases') + 1; j < bonusEffect.indexOf('Gauge') + 1; j++){
                        gaugeName += bonusEffect[j]
                    }
                    action.comboBonus = {...action.comboBonus , [gaugeName] : bonusEffect[bonusEffect.indexOf('Gauge') + 2]}
                }
            }
        }

        //Additional effect stuff
        if (line.includes('Additional')){
            if (line.includes('Restores') && line.includes('MP')){
                //player.changeMP(null) //Stretch goal to have the MP change per skill
            }

            if (line.includes('Damage') && line.includes('over') && line.includes('time')){
                i++
                action.durationPotency = (Math.floor(splitEffect[i][1] / 3)) //per 3 seconds (time/3 - 1 potency guaranteed)
            }
        }

        //Altered Potencies Check
        if (line.includes('Potency:') && !(line.includes('Cure')) && !(line.includes('Combo'))){
            var potencyName = ''
            for (let j = 0; j < line.indexOf('Potency:'); j++){
                potencyName += line[j].toLowerCase()
            }
            action[potencyName] =  line[line.indexOf('Potency:') + 1]
        }

        //Checks for buff/effect granting
        if (line.includes('Grants') && !(line.includes('Combo')) && !(line.includes('to'))){
            //Buffs with stack component
            if(line.includes('stacks')){
                var buffName = ''
                for (let j = line.indexOf('stacks') + 2; j < line.length; j++){
                    if (line[j].includes(',')){
                        buffName += (line[j].replace(',','')).toLowerCase()
                        break;
                    }
                    buffName += line[j].toLowerCase()
                }
                action.grants = {...action.grants , [buffName] : line[line.indexOf('Grants') + 1]}
            }
            //Percentage increase in damage buffs
            else if (line.includes('%') && line.includes('damage')){
                let buffName = ''
                var m = line.indexOf('Grants')
                while (!(line[m].includes(','))){
                    buffName += line[m].toLowerCase()
                    m++
                }
                buffName += (line[m + 1].replace(',','')).toLowerCase()
                action.grants = {...action.grants, [buffName] : 1 + ((line[line.indexOf('dealt') + 2].replace('%',''))/100)}
            }
            //General types of buffs
            else{
                let buffName = ''
                for (let j = line.indexOf('Grants') + 1; j < line.length; j++){
                    if (line[j].includes(',')){
                        buffName += (line[j].replace(',','')).toLowerCase()
                        break;
                    }
                    buffName += line[j].toLowerCase()
                }
                action.grants = {...action.grants , [buffName] : -1}
            }
        }

        //Checks for buff/effect requirement to use
        if (line.includes('executed') && line.includes('under') && line.includes('effect')){
            var requirement = ''
            for (let j = line.indexOf('of') + 1; j < line.length; j++){
                var tempWord = line[j]
                if (tempWord.includes('.')){
                    tempWord = tempWord.replace('.', '')
                }
                requirement += tempWord
                if (j < line.length - 1){
                    requirement += " "
                }
            }
            action.buffRequirement = requirement
        }

        //Gauge Cost check
        if (line.includes('Gauge')){
            var gaugeName = ''
            for (let j = 0; j < line.indexOf('Gauge') + 1; j++){
                gaugeName += line[j]
            }
            action[gaugeName] = line[line.indexOf('Cost:') + 1]
        }

        //Percentage increase in damage check
        if (line.includes('Increases') && line.includes('damage') && line.includes('dealt')){
            action.damageBuff = 1 + ((line[line.indexOf('dealt') + 2].replace('%',''))/100)
        }
    }
}