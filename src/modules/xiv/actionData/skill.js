const skillType = Object.freeze({
    WeaponSkill, Ability, Spell
})

class Skill{
    constructor(skillImage, skillName, levelReq, skillType, castTime, recastTime, effect, range, radius){
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

    //Setters
    setGaugeCost(newCost){
        this.gaugeCost = newCost
    }

    setDuration(newDuration){
        this.duration = newDuration
    }

    setSkillPotency(newSkillPotency){
        this.skillPotency = newSkillPotency
    }

    setDurationPotency(newDurationPotency){
        this.durationPotency = newDurationPotency
    }

    setAlteredPotencies(newAlteredPotencies){
        this.alteredPotencies = newAlteredPotencies
    }

    setComboAction(newComboAction){
        this.comboAction = newComboAction
    }

    setComboPotency(newComboPotency){
        this.comboPotency = newComboPotency
    }

    setAdditionalEffect(newAdditionalEffect){
        this.additionalEffect = newAdditionalEffect
    }

    setBuffActivation(newBuffActivation){
        this.buffActivation = newBuffActivation
    }

    setBuffRequirement(newBuffRequirement){
        this.buffRequirement = newBuffRequirement
    }
}