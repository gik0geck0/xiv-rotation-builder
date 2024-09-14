import { camelize } from '../utils';

describe('xiv/utils', () => {
    describe('camelize', () => {
        it('camelizes lowercase words', () => {
            expect(camelize('some words that foo bar')).toEqual(
                'someWordsThatFooBar'
            );
        });

        it('camelizes uppercase words', () => {
            expect(camelize('SOME WORDS THAT FOO BAR')).toEqual(
                'someWordsThatFooBar'
            );
        });

        it('camelizes mixedcase words and retains midword capitals', () => {
            expect(camelize('Some WoRdS thaT Foo bAR')).toEqual(
                'someWordsThatFooBar'
            );
        });

        it('camelizes one word', () => {
            expect(camelize('word')).toEqual('word');
        });

        it('camelizes one uppercase word', () => {
            expect(camelize('WoRd')).toEqual('word');
        });

        it('camelizes one letter', () => {
            expect(camelize('w')).toEqual('w');
        });

        it('camelizes one uppercase letter', () => {
            expect(camelize('W')).toEqual('w');
        });
    });
});
