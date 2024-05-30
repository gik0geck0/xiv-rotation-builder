function parseEffect(skill){
    //Split the effect by line and then each line by spaces
    var splitEffect = (skill.getEffect()).split("<br>")
    for (let i = 0; i < splitEffect.length; i++){
        splitEffect[i].split(" ")
    }

    //Go through every line of the effect
    for (let i = 0; i < splitEffect.length; i++){
        var line = splitEffect[i]
        if (line.contains('potency')){
            skill.setSkillPotency(line[line.indexof('potency') + 2])
            break;
        }

        if (line.contains('Duration:')){
            skill.setDuration(line[line.indexof('Duration:')].replace('s', ''))
            break;
        }

        //Parse combo things
        if (line.contains('Combo')){
            if (line.contains('Action:')){
                //Add the entire combo skill to the comboAction
                var actionName = ''
                for (let k = line.indexof('Action:') + 1; k < line.length; k++){
                    actionName += (line[k] + ' ')
                }
                skill.setComboAction(actionName)
                break;
            }

            if (line.contains('Potency:')){
                skill.setComboPotency(line[line.indexof('Potency:') + 1])
                break;
            }
            
            if (line.contains('Bonus:')){
                //Add the entire effect to the comboBonus
                var bonusEffect = ''
                for (let k = line.indexof('Bonus:') + 1; k < line.length; k++){
                    bonusEffect += (line[k] + ' ')
                }
                var newBonusEffect = (skill.getComboBonus()).push(bonusEffect)
                skill.setComboBonus(newBonusEffect)
                break;
            }
        }

        //Additional effect stuff
        if (line.contains('Additional')){
            if (line.contains('Restores') && line.contains('MP')){
                //player.changeMP(null) //Stretch goal to have the MP change per skill
                break;
            }

            if (line.contains('Damage') && line.contains('over') && line.conatins('time')){
                i++
                skill.setDurationPotency(Math.floor(splitEffect[i][1] / 3)) //per 3 seconds (time/3 - 1 potency guaranteed)
                break;
            }
        }

        //Altered Potencies Check
        if (line.contains('Potency:') && !(line.contains('Cure')) && !(line.contains('Combo'))){
            var potencyName = ''
            for (let i = 0; i < line.indexof('Potency:'); i++){
                potencyName += line[i]
            }
            var newAlteredPotencies = (skill.getAlteredPotencies()).push({potencyName : line[line.indexof('Potency:') + 1]})
            skill.setAlteredPotencies(newAlteredPotencies)
            break;
        }

        //Checks for buff/effect granting
        if (line.contains('Grants') && !(line.contains('Combo'))){
            if(line.contains('stacks')){
                var buffName = ''
                for (let i = line.indexof('stacks') + 2; i < line.length; i++){
                    if (line[i] == ','){
                        break;
                    }
                    buffName += line[i]
                }
                var newBuffActivation = (skill.getBuffActivation()).push({buffName : line[line.indexof('Grants') + 1]})
                skill.setBuffActivation(newBuffActivation)
                break;
            }
            else{
                var buffName = ''
                for (let i = line.indexof('Grants') + 1; i < line.length; i++){
                    if (line[i] == ','){
                        break;
                    }
                    buffName += line[i]
                }
                var newBuffActivation = (skill.getBuffActivation()).push({buffName : 0})
                skill.setBuffActivation(newBuffActivation)
                break;
            }
        }

        //Checks for buff/effect requirement to use
        if (line.conatins('executed') && line.conatins('under') && line.conatins('effect')){
            var requirement = ''
            for (let i = line.indexof('of'); i < line.length; i++){
                var tempWord = line[i]
                if (tempWord.contains('.')){
                    tempWord.replace('.', '')
                }
                requirement += tempWord
            }
            skill.setBuffRequirement(requirement)
            break;
        }

        //Gauge Cost check
        if (line.contains('Gauge')){
            var gaugeName = ''
            for (let i = 0; i < line.indexof('Gauge') + 1; i++){
                gaugeName += line[i]
            }
            skill.setGaugeCost({gaugeName : line[line.indexof('Cost') + 1]})
            break;
        }
    }
}