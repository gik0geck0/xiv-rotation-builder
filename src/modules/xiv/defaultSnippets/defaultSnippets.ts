// defaultSnippets.ts

import pld from './pld.js';
import war from './war.js';
import drk from './drk.js';
import gnb from './gnb.js';
import whm from './whm.js';
import ast from './ast.js';
import sge from './sge.js';
import drg from './drg.js';
import sam from './sam.js';
import rpr from './rpr.js';
import brd from './brd.js';
import mch from './mch.js';
import dnc from './dnc.js';
import blm from './blm.js';
import rdm from './rdm.js';
import pct from './pct.js';
import type { JobResources } from './snippetTypes';  // Import the interfaces

// Define DefaultJobResources object with type
export const DefaultJobResources: { [job: string]: JobResources } = {
    PLD: pld as JobResources,
    WAR: war as JobResources,
    DRK: drk as JobResources,
    GNB: gnb as JobResources,
    WHM: whm as JobResources,
    AST: ast as JobResources,
    SGE: sge as JobResources,
    DRG: drg as JobResources,
    SAM: sam as JobResources,
    RPR: rpr as JobResources,
    BRD: brd as JobResources,
    MCH: mch as JobResources,
    DNC: dnc as JobResources,
    BLM: blm as JobResources,
    RDM: rdm as JobResources,
    PCT: pct
};
