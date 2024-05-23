import player from 'xiv/actionData';

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
            for (let j = 0; j < line.length; j++){
                if (line[j] === 'potency'){
                    j+=2
                    this.skillPotency = line[j]
                    break;
                }

                if (line[j] === 'Duration:'){
                    j++
                    this.duration = line[j].replace('s', '')
                    break;
                }

                //Parse combo things
                if (line[j] === 'Combo'){
                    j++
                    if (line[j] === 'Action:'){
                        j++
                        //Add the entire combo skill to the comboAction
                        var actionName = ''
                        for (let k = j; k < line.length; k++){
                            actionName += (line[k] + ' ')
                        }
                        this.comboAction = actionName
                        break;
                    }

                    if (line[j] === 'Potency:'){
                        j++
                        this.comboPotency = line[j]
                        break;
                    }
                    
                    if (line[j] === 'Bonus:'){
                        j++
                        //Add the entire effect to the comboBonus
                        var bonusEffect = ''
                        for (let k = j; k < line.length; k++){
                            bonusEffect += (line[k] + ' ')
                        }
                        (this.comboBonus).push(bonusEffect)
                        break;
                    }
                }

                //Additional effect stuff
                if (line[j] === 'Additional'){
                    j+=2
                    if (line[j] === 'Restores' && line[j + 1] === 'MP'){
                       this.player.restoreMP();
                       break;
                    }

                    if (line[j] === 'Damage' && line[j + 1] === 'over' && line[j + 2] === 'time'){
                        i++
                        this.durationPotency = Math.floor(splitEffect[i][1] / 3) //per 3 seconds (time/3 - 1 potency guaranteed)
                        break;
                    }
                }

                //Checks for each job's unique effect text
                if (this.player.getJob === jobType.Paladin){
                    if (line[j] === 'Oath'){
                        j+=2
                        this.gaugeCost = line[j]
                        break;
                    }

                    if (line[j] === 'Divine' && line[j + 1] === 'Might' && line[j + 2] === 'Potency:'){
                        j+=2
                        this.alteredPotencies.push(['Divine Might', line[j]])
                        break;
                    }

                    if (line[j] === 'Requiescat' && line[j + 1] === 'Potency:'){
                        j++
                        this.alteredPotencies.push(['Requiescat', line[j]])
                        break;
                    }
                }

                if (this.player.getJob === jobType.Warrior){

                }

                if (this.player.getJob === jobType.DarkKnight){

                }

                if (this.player.getJob === jobType.Gunbreaker){

                }

                if (this.player.getJob === jobType.WhiteMage){

                }

                if (this.player.getJob === jobType.Scholar){

                }

                if (this.player.getJob === jobType.Astrologian){
                    
                }

                if (this.player.getJob === jobType.Sage){
                    
                }

                if (this.player.getJob === jobType.Monk){
                    
                }

                if (this.player.getJob === jobType.Dragoon){
                    
                }

                if (this.player.getJob === jobType.Ninja){
                    
                }

                if (this.player.getJob === jobType.Samurai){
                    
                }

                if (this.player.getJob === jobType.Reaper){
                    
                }

                if (this.player.getJob === jobType.Bard){
                    
                }

                if (this.player.getJob === jobType.Machinist){
                    
                }

                if (this.player.getJob === jobType.Dancer){
                    
                }

                if (this.player.getJob === jobType.BlackMage){
                    
                }

                if (this.player.getJob === jobType.Summoner){
                    
                }

                if (this.player.getJob === jobType.RedMage){
                    
                }
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
}