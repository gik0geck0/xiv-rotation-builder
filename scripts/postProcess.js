#!/usr/bin/env node

import XIVFinal from "./XIVFinal.json" with {type: "json"};
import jobStaticData from "./jobStaticData.json" with {type: "json"};
import fs from "fs";
import { mergeDeep } from "./utils.js";

// merge
const combined = mergeDeep(jobStaticData, XIVFinal);

// TODO: process effects

// create output file
const fileName = "../src/modules/xiv/actionData/jobGuide.js";
// prefix with export clause
fs.writeFileSync(fileName, "export default ");

// append formatted data (basically json except for the above)
fs.writeFileSync(fileName, JSON.stringify(combined, null, 4), { flag: "a" });