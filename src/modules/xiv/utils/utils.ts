// https://stackoverflow.com/questions/2970525/converting-a-string-with-spaces-into-camel-case
export function camelize(str: string): string {
    return str
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
}
