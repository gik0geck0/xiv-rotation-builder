export default {
    generationDate: "5/15/2024 8:29:00 -0600"
};
import jobGuideJson from "./jobGuide";
import { camelize } from "xiv/utils";
import Skill from './skill';
import { parseEffect } from './parseEffect'

// insert action IDs
for (const jobName in jobGuideJson) {
    const jobActions = jobGuideJson[jobName].actions;
    for (const action of jobActions) {
        action.id = camelize(action.name);
    }
}

//Adding effect parsing into the jobGuide
for (const jobName in jobGuideJson) {
  const jobActions = jobGuideJson[jobName].actions;
  for (const action of jobActions) {
      //var newSkill = new Skill(action.icon, action.name, action.level, action.type, action.cast, action.recast, action.cost, action.effect, 0, 0);
      parseEffect(action)
    
      /*
      action.gaugeCost = newSkill.getGaugeCost()
      action.duration = newSkill.getDuration()
      action.skillPotency = newSkill.getSkillPotency()
      action.durationPotency = newSkill.getDurationPotency()

      for (let i = 0; i < newSkill.getAlteredPotencies().length; i++){
        action.newSkill.getAlteredPotencies()[i][0] = newSkill.getAlteredPotencies()[i][1]
      }

      action.comboAction = newSkill.getComboAction()
      action.comboPotency = newSkill.getComboPotency()
      action.comboBonus = newSkill.getComboBonus()

      for (let i = 0; i < newSkill.getAdditionalEffect().length; i++){
        action.additionalEffect += newSkill.getAdditionalEffect[i]
      }

      for (let i = 0; i < newSkill.getBuffActivation().length; i++){
        action.newSkill.getBuffActivation()[i][0] = newSkill.getBuffActivation()[i][1]
      }

      action.buffRequirement = newSkill.getBuffRequirement()
      */
  }
}

export const JobGuide = jobGuideJson;