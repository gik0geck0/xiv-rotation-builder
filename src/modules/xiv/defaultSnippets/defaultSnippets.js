import pld from './jobSnippets/pld/pld.json';
import war from './jobSnippets/war/war.json';
import drk from './jobSnippets/drk/drk.json';
import gnb from './jobSnippets/gnb/gnb.json';
import whm from './jobSnippets/whm/whm.json';
import ast from './jobSnippets/ast/ast.json';
import sge from './jobSnippets/sge/sge.json';
import drg from './jobSnippets/drg/drg.json';
import sam from './jobSnippets/sam/sam.json';
import rpr from './jobSnippets/rpr/rpr.json';
import brd from './jobSnippets/brd/brd.json';
import mch from './jobSnippets/mch/mch.json';
import dnc from './jobSnippets/dnc/dnc.json';
import blm from './jobSnippets/blm/blm.json';
import rdm from './jobSnippets/rdm/rdm.json';
import pct from './jobSnippets/pct/pct.json';

/**
 * TS Def
 * JobResources: {
 *      [job: string]: {
 *          "customActions": CustomAction[],
 *          "snippets": Snippet[]
 *      }
 * }
 *
 * CustomAction: {
 *      [actionName: string]: {
 *          description: string;
 *          type: "pick" | "action";
 *          icon: string;
 *          options?: string[]
 *      }
 * }
 *
 * Snippet: {
 *      name: string;
 *      description: string;
 *      versions: [{
 *          name: string;
 *          description: string;
 *          actions: TimelineAction[]
 *      }]
 * }
 *
 * TimelineAction: {
 *      time: number;
 *      action?: string;
 *      shortcut?: string;
 * }
 */
export const DefaultJobResources = {
    PLD: pld,
    WAR: war,
    DRK: drk,
    GNB: gnb,
    WHM: whm,
    AST: ast,
    SGE: sge,
    DRG: drg,
    SAM: sam,
    RPR: rpr,
    BRD: brd,
    MCH: mch,
    DNC: dnc,
    BLM: blm,
    RDM: rdm,
    PCT: pct
};
