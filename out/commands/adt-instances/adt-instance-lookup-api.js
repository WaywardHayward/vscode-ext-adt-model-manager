"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdtApiUrl = void 0;
const azure_location_shortname_lookup_1 = require("../azure/azure-location-shortname-lookup");
function getAdtApiUrl(name, location) {
    let locationShortCode = azure_location_shortname_lookup_1.lookupLocationShortName(location);
    return `https://${name}.api.${locationShortCode}.digitaltwins.azure.net`;
}
exports.getAdtApiUrl = getAdtApiUrl;
//# sourceMappingURL=adt-instance-lookup-api.js.map