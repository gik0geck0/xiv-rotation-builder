import pld from './jobSnippets/pld/pld.json';
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
    BLM: blm
};
