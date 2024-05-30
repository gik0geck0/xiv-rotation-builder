<<<<<<< HEAD
import skill from 'xiv/actionData';

export default {
    generationDate: "5/15/2024 8:29:00 -0600",
    pld: {
        "Holy Spirit": {
            id: "holySpirit",
            description: "Deals unaspected damage with a potency of 350.\nDivine Might Potency: 450\nRequiescat Potency: 650\nThe effect of Divine Might will be prioritized over Requiescat when under the effect of both.\nAdditional Effect: Restores own HP\nCure Potency: 400 ",
            type: "Spell",
            cast: 1.5,
            recast: 2.5
        }
=======
import jobGuideJson from "./jobGuide";
import { camelize } from "xiv/utils";

// insert action IDs
for (const jobName in jobGuideJson) {
    const jobActions = jobGuideJson[jobName].actions;
    for (const action of jobActions) {
        action.id = camelize(action.name);
>>>>>>> 76fb6f5b820f8502f1c020949fffaea2ac2b6b82
    }
}

export const JobGuide = jobGuideJson;