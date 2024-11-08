// import { LightningElement } from 'lwc';
// import { getActionInfo } from 'xiv/actionRepository';
// import { getJobNames } from 'xiv/actionRepository';
// import { getJobActions } from 'xiv/actionRepository';
// import { JobGuide } from 'xiv/actionData';
// import HelloWorldApp  from '../rotationBuilder';
// import { parseEffect } from '../../actionData/parseEffect';

import { DefaultJobResources } from "xiv/defaultSnippets";
import { getActionInfo } from "xiv/actionRepository";
import { JobGuide } from "../../actionData/actionData";

// Handled undefined actions
// Undefined: return 0, otherwise return action's potency
function getPotency(action, context): number {
    if(!action) {
        console.warn(`Undefined action info for ${context}`);
        return 0;
    }

    return parseFloat(action.comboPotency || action.potency || 0);
}

// Test the potency of a specified snippet for a given job
function testSnippetPotency(testName, snippetName, jobKey, jobName, version, expectedPotency): void {
    if(!JobGuide[jobName]) {
        console.warn(`Undefined job info for ${jobName}`);
        return;
    }

    test(testName, () => {
        const jobSnippet = DefaultJobResources[jobKey].snippets.find((s) => s.name === snippetName);
        const actionList = jobSnippet.versions[version].actions.map((snippetAction) => {
            const actionInfo = getActionInfo(jobName, snippetAction.action);
            return {actionInfo, actionName: snippetAction.action};
        });

        //console.log("Actions: ", actionList);

        const sumPotency = actionList.reduce((accum, {actionInfo, actionName}) => {
            return accum + getPotency(actionInfo, `Action: ${actionName}`);
        }, 0);

        expect(sumPotency).toEqual(expectedPotency);
    })
}

describe('xiv/rotationBuilder', () => {

    beforeEach(() => {
        
    });

    afterEach(() => {

        jest.clearAllMocks();
    });

    describe('sanity check', () => {
        it('should work', () => {
            expect(true).toEqual(true);
        });
    });

    describe('snippet tests', () => {

        // Paladin snippet tests
        testSnippetPotency('pld 12 potency', '12', 'PLD', 'paladin', 0, 500); // Pre-7.0 '12'
        testSnippetPotency('pld opener potency', 'balanceOpener', 'PLD', 'paladin', 1, 12485); // Current Opener
        testSnippetPotency('pld combo', 'Quick Combo', 'PLD', 'paladin', 0, 3010); // Quick Combo

        // Warrior snippet tests
        testSnippetPotency('war 123 potency', '123', 'WAR', 'warrior', 0, 1040); // 123

        // Dark Knight snippet tests
        testSnippetPotency('drk combo breaker potency', 'Combo Breaker', 'DRK', 'darkknight', 0, 800); // Combo Breaker

        // Gunbreaker snippet tests
        testSnippetPotency('gnb cartridge potency', 'Cartridge Spender', 'GNB', 'gunbreaker', 0, 2770); // Cartridge Spender

        // White Mage snippet tests
        testSnippetPotency('whm opener potency', 'BalanceOpener', 'WHM', 'whitemage', 0, 6115); // Current Opener

        // Astrologian snippet tests
        testSnippetPotency('ast earthly star', 'Earthly Star', 'AST', 'astrologian', 0, 3980); // Earthly Star

        // Sage snippet tests
        testSnippetPotency('sge dosis potency', 'Dosis Spam', 'SGE', 'sage', 0, 2100); // Dosis Spam

        // Dragoon snippet tests
        testSnippetPotency('drg thrust potency', 'Thrust Combo', 'DRG', 'dragoon', 0, 1790); // Thrust Combo

        // Samurai snippet tests
        testSnippetPotency('sam full sen', 'Full Sen', 'SAM', 'samurai', 0, 3385.60); // Full Sen
        testSnippetPotency('sam same sen', 'Same Sen', 'SAM', 'samurai', 0, 1910); // Same Sen

        // Reaper snippet tests
        testSnippetPotency('rpr opener potency', 'BalanceOpener', 'RPR', 'reaper', 0, 13143.70); // Current Opener

        // Bard snippet tests
        testSnippetPotency('brd opener potency', 'BalanceOpener', 'BRD', 'bard', 0, 7005.80); // Current Opener

        // Machinist snippet tests
        testSnippetPotency('mch chainsaw potency', 'Chainsaw', 'MCH', 'machinist', 0, 1200);

        // Dancer snippet tests
        testSnippetPotency('dnc step potency', 'Standard Step', 'DNC', 'dancer', 0, 850); // Standard Step

        // Black Mage snippet tests
        testSnippetPotency('blm opener potency', 'BalanceOpener', 'BLM', 'blackmage', 0, 9424); // Current Opener
        testSnippetPotency('blm despair', 'Early Despair', 'BLM', 'blackmage', 0, 910); // Despair
        testSnippetPotency('blm aspect mastery', 'Aspect Mastery III', 'BLM', 'blackmage', 0, 2608); // Aspect Mastery
    
        // Red Mage snippet tests
        testSnippetPotency('rdm melee potency', 'Melee Spender', 'RDM', 'redmage', 0, 2420); // Melee Spender

        // Pictomancer snippet tests
        testSnippetPotency('pct palette potency', 'Palette Combo', 'PCT', 'pictomancer', 0, 6280);
    });
});
