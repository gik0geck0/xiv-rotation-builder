import jobGuideJson from "./jobGuide";

// https://stackoverflow.com/questions/2970525/converting-a-string-with-spaces-into-camel-case
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

// insert action IDs
for (const jobName in jobGuideJson) {
    const jobActions = jobGuideJson[jobName].actions;
    for (const action of jobActions) {
        action.id = camelize(action.name);
    }
}

export const JobGuide = jobGuideJson;