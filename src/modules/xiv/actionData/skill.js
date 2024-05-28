const skillType = Object.freeze({
    WeaponSkill, Ability, Spell
})

class Skill{
    constructor(skillImage, skillName, levelReq, skillType, castTime, recastTime, effect, range, radius, player){
        //Variables from the user
        this.player = player

        //Varaibles from the json
        this.skillImage = skillImage
        this.skillName = skillName
        this.levelReq = levelReq
        this.skillType = skillType
        this.castTime = castTime
        this.recastTime = recastTime
        this.effect = effect
        this.range = range
        this.radius = radius

        //Varibles from the effect
        this.gaugeCost = null
        this.stacks = null
        this.duration = null
        this.skillPotency = null
        this.durationPotency = null
        this.alteredPotencies = [] //An array containing values of (potency name, value)

        this.comboAction = null //Will be another skill just store the name and can derefernce later
        this.comboPotency = null
        this.comboBonus = []

        this.additionalEffect = []
        this.buffActivation = [] //Contains values of {buffName : stacks}
        this.buffRequirement = null //Will be the name of a skill

        this.parseEffect()
    }

    //Member functions
    parseEffect(){
        //Split the effect by line and then each line by spaces
        var splitEffect = (this.effect).split("<br>")
        for (let i = 0; i < splitEffect.length; i++){
            splitEffect[i].split(" ")
        }

        //Go through every line of the effect
        for (let i = 0; i < splitEffect.length; i++){
            var line = splitEffect[i]
            if (line.contains('potency')){
                this.skillPotency = line[line.indexof('potency') + 2]
                break;
            }

            if (line.contains('Duration:')){
                this.duration = line[line.indexof('Duration:')].replace('s', '')
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
                    this.comboAction = actionName
                    break;
                }

                if (line.contains('Potency:')){
                    this.comboPotency = line[line.indexof('Potency:') + 1]
                    break;
                }
                
                if (line.contains('Bonus:')){
                    //Add the entire effect to the comboBonus
                    var bonusEffect = ''
                    for (let k = line.indexof('Bonus:') + 1; k < line.length; k++){
                        bonusEffect += (line[k] + ' ')
                    }
                    (this.comboBonus).push(bonusEffect)
                    break;
                }
            }

            //Additional effect stuff
            if (line.contains('Additional')){
                if (line.contains('Restores') && line.contains('MP')){
                    this.player.changeMP(null) //Stretch goal to have the MP change per skill
                    break;
                }

                if (line.contains('Damage') && line.contains('over') && line.conatins('time')){
                    i++
                    this.durationPotency = Math.floor(splitEffect[i][1] / 3) //per 3 seconds (time/3 - 1 potency guaranteed)
                    break;
                }
            }

            //Altered Potencies Check
            if (line.contains('Potency:') && !(line.contains('Cure')) && !(line.contains('Combo'))){
                var potencyName = ''
                for (let i = 0; i < line.indexof('Potency:'); i++){
                    potencyName += line[i]
                }
                this.alteredPotencies.push({potencyName : line[line.indexof('Potency:') + 1]})
            }

            //Checks for buff/effect granting
            if (line.contains('Grants') && !(line.contains('Bonus'))){
                if(line.contains('stacks')){
                    var buffName = ''
                    for (let i = line.indexof('stacks') + 2; i < line.length; i++){
                        if (line[i] == ','){
                            break;
                        }
                        buffName += line[i]
                    }
                    this.buffActivation.push({buffName : line[line.indexof('Grants') + 1]})
                }
                else{
                    var buffName = ''
                    for (let i = line.indexof('Grants') + 1; i < line.length; i++){
                        if (line[i] == ','){
                            break;
                        }
                        buffName += line[i]
                    }
                    this.buffActivation.push({buffName : 0})
                }
            }

            //Checks for buff/effect requirement to use
            if (line.conatins('executed') && line.conatins('under') && line.conatins('effect')){
                this.buffRequirement = ''
                for (let i = line.indexof('of'); i < line.length; i++){
                    var tempWord = line[i]
                    if (tempWord.contains('.')){
                        tempWord.replace('.', '')
                    }
                    this.buffRequirement += tempWord
                }
            }

            //Gauge Cost check
            if (line.contains('Gauge')){
                var gaugeName = ''
                for (let i = 0; i < line.indexof('Gauge') + 1; i++){
                    gaugeName += line[i]
                }
                this.gaugeCost = {gaugeName : line[line.indexof('Cost') + 1]}
            }
        }
    }

    //Getters
    getSkillImage(){
        return this.skillImage
    }

    getSkillName(){
        return this.skillName
    }

    getLevelReq(){
        return this.levelReq
    }

    getSkillType(){
        return this.skillType
    }

    getCastTime(){
        return this.castTime
    }

    getRecastTime(){
        return this.recastTime
    }

    getEffect(){
        return this.effect
    }

    getRange(){
        return this.range
    }

    getRadius(){
        return this.radius
    }

    getGaugeCost(){
        return this.gaugeCost
    }

    getStacks(){
        return this.stacks
    }

    getDuration(){
        return this.duration
    }

    getSkillPotency(){
        return this.skillPotency
    }

    getDurationPotency(){
        return this.durationPotency
    }

    getAlteredPotencies(){
        return this.alteredPotencies
    }

    getComboAction(){
        return this.comboAction
    }

    getComboPotency(){
        return this.comboPotency
    }

    getAdditionalEffect(){
        return this.additionalEffect
    }

    getBuffActivation(){
        return this.buffActivation
    }

    getBuffRequirement(){
        return this.buffRequirement
    }
}