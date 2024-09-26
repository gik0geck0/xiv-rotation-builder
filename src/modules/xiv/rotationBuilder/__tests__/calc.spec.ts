// import { LightningElement } from 'lwc';
// import { getActionInfo } from 'xiv/actionRepository';
// import { getJobNames } from 'xiv/actionRepository';
// import { getJobActions } from 'xiv/actionRepository';
// import { JobGuide } from 'xiv/actionData';
// import HelloWorldApp  from '../rotationBuilder';
// import { parseEffect } from '../../actionData/parseEffect';

import { DefaultJobResources } from "xiv/defaultSnippets";
import { getActionInfo } from "xiv/actionRepository";

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

    describe('snippet test', () => {

        test('pld opener potency', () => {
            const pldBalanceOpener = DefaultJobResources.PLD.snippets.find((s) => s.name === "12");
            const actionList = pldBalanceOpener.versions[0].actions.map((snippetAction) => {
                return getActionInfo("paladin", snippetAction.action);
            });
            console.log("Actions: ", actionList);
            const sumPotency = actionList.reduce((accum, a) => {
                return accum + parseFloat(a.comboPotency || a.potency);
            }, 0);
            expect(sumPotency).toEqual(500);
        })

    });
});
