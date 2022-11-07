export function splitParameters(parameters: string): string[] {
    return parameters ? parameters.split(/,(?![^(]*\))/g) : []
}