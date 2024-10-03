// import { LightningElement } from 'lwc';
// import { getActionInfo } from 'xiv/actionRepository';
// import { getJobNames } from 'xiv/actionRepository';
// import { getJobActions } from 'xiv/actionRepository';
// import { JobGuide } from 'xiv/actionData';
// import HelloWorldApp  from '../rotationBuilder';
// import { parseEffect } from '../../actionData/parseEffect';

import { DefaultJobResources } from "xiv/defaultSnippets";
import { getActionInfo } from "xiv/actionRepository";

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

        // White Mage snippet tests
        testSnippetPotency('whm opener potency', 'BalanceOpener', 'WHM', 'whitemage', 0, 6115); // Current Opener

        // Reaper snippet tests
        testSnippetPotency('rpr opener potency', 'BalanceOpener', 'RPR', 'reaper', 0, 13143.70); // Current Opener

        // Bard snippet tests
        testSnippetPotency('brd opener potency', 'BalanceOpener', 'BRD', 'bard', 0, 7005.80); // Current Opener

        // Black Mage snippet tests
        testSnippetPotency('blm opener potency', 'BalanceOpener', 'BLM', 'blackmage', 0, 9424); // Current Opener
        

    });
});
