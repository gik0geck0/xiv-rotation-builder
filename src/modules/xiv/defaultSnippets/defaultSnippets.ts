// defaultSnippets.ts

import pldData from './pld.js';  // Import the JSON
import type { JobResources } from './snippetTypes';  // Import the interfaces

// Define DefaultJobResources object with type
export const DefaultJobResources: { [job: string]: JobResources } = {
    PLD: pldData as JobResources  // Cast the JSON data to the JobResources interface
};
