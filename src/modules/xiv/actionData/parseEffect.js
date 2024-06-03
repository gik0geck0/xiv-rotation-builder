export function parseEffect(action){
    //Split the effect by line and then each line by spaces
    if ((action.effect).includes("<BR>")){
        (action.effect).replace('<BR>', '<br>')
    }
    let splitEffect = (action.effect).split("<br>")
    
    for (let i = 0; i < splitEffect.length; i++){
        splitEffect[i] = splitEffect[i].split(" ")
    }

    //Go through every line of the effect
    for (let i = 0; i < splitEffect.length; i++){
        var line = splitEffect[i]
        if (line.includes('potency')){
            var temp = (line[line.indexOf('potency') + 2])
            if (temp.includes('.')){
                temp.replace('.', '')
            }
            action.potency = temp
            console.log(temp)
            break;
        }

        if (line.includes('Duration:')){
            action.duration = (line[line.indexOf('Duration:')].replace('s', ''))
            break;
        }

        //Parse combo things
        if (line.includes('Combo')){
            if (line.includes('Action:')){
                //Add the entire combo skill to the comboAction
                var actionName = ''
                for (let k = line.indexOf('Action:') + 1; k < line.length; k++){
                    actionName += (line[k] + ' ')
                }
                action.comboAction = actionName
                break;
            }

            if (line.includes('Potency:')){
                action.comboPotency = (line[line.indexof('Potency:') + 1])
                break;
            }
            
            if (line.includes('Bonus:')){
                //Add the entire effect to the comboBonus
                var bonusEffect = ''
                for (let k = line.indexOf('Bonus:') + 1; k < line.length; k++){
                    bonusEffect += (line[k] + ' ')
                }
                //action.comboBonus = (action.comboBonus).push(bonusEffect)
                break;
            }
        }

        //Additional effect stuff
        if (line.includes('Additional')){
            if (line.includes('Restores') && line.includes('MP')){
                //player.changeMP(null) //Stretch goal to have the MP change per skill
                break;
            }

            if (line.includes('Damage') && line.includes('over') && line.includes('time')){
                i++
                action.durationPotency = (Math.floor(splitEffect[i][1] / 3)) //per 3 seconds (time/3 - 1 potency guaranteed)
                break;
            }
        }

        //Altered Potencies Check
        if (line.includes('Potency:') && !(line.includes('Cure')) && !(line.includes('Combo'))){
            var potencyName = ''
            for (let i = 0; i < line.indexOf('Potency:'); i++){
                potencyName += line[i]
            }
            //var tempAltered = (action.alteredPotencies).push([potencyName, line[line.indexOf('Potency:') + 1]])
            action[potencyName] =  line[line.indexOf('Potency:') + 1]
            break;
        }

        //Checks for buff/effect granting
        if (line.includes('Grants') && !(line.includes('Combo'))){
            if(line.includes('stacks')){
                var buffName = ''
                for (let i = line.indexOf('stacks') + 2; i < line.length; i++){
                    if (line[i] === ','){
                        break;
                    }
                    buffName += line[i]
                }
                //var tempBuff = (action.buffActivation).push([buffName , line[line.indexOf('Grants') + 1]])
                action.grants[buffName] = line[line.indexOf('Grants') + 1]
                break;
            }
            else{
                var buffName = ''
                for (let i = line.indexOf('Grants') + 1; i < line.length; i++){
                    if (line[i] === ','){
                        break;
                    }
                    buffName += line[i]
                }
                //var tempBuff = (action.buffActivation).push([buffName, 0])
                action.grants[buffName] = 0
                break;
            }
        }

        //Checks for buff/effect requirement to use
        if (line.includes('executed') && line.includes('under') && line.includes('effect')){
            var requirement = ''
            for (let i = line.indexOf('of'); i < line.length; i++){
                var tempWord = line[i]
                if (tempWord.includes('.')){
                    tempWord.replace('.', '')
                }
                requirement += tempWord
            }
            action.buffRequirement = (requirement)
            break;
        }

        //Gauge Cost check
        if (line.includes('Gauge')){
            var gaugeName = ''
            for (let i = 0; i < line.indexOf('Gauge') + 1; i++){
                gaugeName += line[i]
            }
            action.gaugeCost = ([gaugeName , line[line.indexOf('Cost') + 1]])
            break;
        }
    }
}
/*
export function parseEffect(skill){
    //Split the effect by line and then each line by spaces
    var splitEffect = (skill.getEffect()).split("<br>")
    for (let i = 0; i < splitEffect.length; i++){
        splitEffect[i].split(" ")
    }

    //Go through every line of the effect
    for (let i = 0; i < splitEffect.length; i++){
        var line = splitEffect[i]
        if (line.includes('potency')){
            skill.setSkillPotency(line[line.indexOf('potency') + 2])
            break;
        }

        if (line.includes('Duration:')){
            skill.setDuration(line[line.indexOf('Duration:')].replace('s', ''))
            break;
        }

        //Parse combo things
        if (line.includes('Combo')){
            if (line.includes('Action:')){
                //Add the entire combo skill to the comboAction
                var actionName = ''
                for (let k = line.indexOf('Action:') + 1; k < line.length; k++){
                    actionName += (line[k] + ' ')
                }
                skill.setComboAction(actionName)
                break;
            }

            if (line.includes('Potency:')){
                skill.setComboPotency(line[line.indexof('Potency:') + 1])
                break;
            }
            
            if (line.includes('Bonus:')){
                //Add the entire effect to the comboBonus
                var bonusEffect = ''
                for (let k = line.indexOf('Bonus:') + 1; k < line.length; k++){
                    bonusEffect += (line[k] + ' ')
                }
                var newBonusEffect = (skill.getComboBonus()).push(bonusEffect)
                skill.setComboBonus(newBonusEffect)
                break;
            }
        }

        //Additional effect stuff
        if (line.includes('Additional')){
            if (line.includes('Restores') && line.includes('MP')){
                //player.changeMP(null) //Stretch goal to have the MP change per skill
                break;
            }

            if (line.includes('Damage') && line.includes('over') && line.includes('time')){
                i++
                skill.setDurationPotency(Math.floor(splitEffect[i][1] / 3)) //per 3 seconds (time/3 - 1 potency guaranteed)
                break;
            }
        }

        //Altered Potencies Check
        if (line.includes('Potency:') && !(line.includes('Cure')) && !(line.includes('Combo'))){
            var potencyName = ''
            for (let i = 0; i < line.indexOf('Potency:'); i++){
                potencyName += line[i]
            }
            var newAlteredPotencies = (skill.getAlteredPotencies()).push([potencyName, line[line.indexOf('Potency:') + 1]])
            skill.setAlteredPotencies(newAlteredPotencies)
            break;
        }

        //Checks for buff/effect granting
        if (line.includes('Grants') && !(line.includes('Combo'))){
            if(line.includes('stacks')){
                var buffName = ''
                for (let i = line.indexOf('stacks') + 2; i < line.length; i++){
                    if (line[i] === ','){
                        break;
                    }
                    buffName += line[i]
                }
                var newBuffActivation = (skill.getBuffActivation()).push([buffName , line[line.indexOf('Grants') + 1]])
                skill.setBuffActivation(newBuffActivation)
                break;
            }
            else{
                var buffName = ''
                for (let i = line.indexOf('Grants') + 1; i < line.length; i++){
                    if (line[i] === ','){
                        break;
                    }
                    buffName += line[i]
                }
                var newBuffActivation = (skill.getBuffActivation()).push([buffName, 0])
                skill.setBuffActivation(newBuffActivation)
                break;
            }
        }

        //Checks for buff/effect requirement to use
        if (line.includes('executed') && line.includes('under') && line.includes('effect')){
            var requirement = ''
            for (let i = line.indexOf('of'); i < line.length; i++){
                var tempWord = line[i]
                if (tempWord.includes('.')){
                    tempWord.replace('.', '')
                }
                requirement += tempWord
            }
            skill.setBuffRequirement(requirement)
            break;
        }

        //Gauge Cost check
        if (line.includes('Gauge')){
            var gaugeName = ''
            for (let i = 0; i < line.indexOf('Gauge') + 1; i++){
                gaugeName += line[i]
            }
            skill.setGaugeCost([gaugeName , line[line.indexOf('Cost') + 1]])
            break;
        }
    }
}
*/