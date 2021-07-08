import { lookupLocationShortName } from "../azure/azure-location-shortname-lookup";

export function getAdtApiUrl(name:string|undefined, location:string|undefined): string | undefined{
    let locationShortCode = lookupLocationShortName(location);
    return `https://${name}.api.${locationShortCode}.digitaltwins.azure.net`;
}