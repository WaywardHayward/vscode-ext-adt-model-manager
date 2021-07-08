"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupLocationShortName = void 0;
function lookupLocationShortName(location) {
    if (!location) {
        return undefined;
    }
    switch (location.toLowerCase()) {
        case 'northeurope': return 'neu';
        case 'southcentralus': return 'scus';
        case 'westcentralus': return 'wcus';
        case 'westus2': return 'wus2';
        case 'westeurope': return 'weu';
        case 'uksouth': return 'uks';
    }
    return location;
}
exports.lookupLocationShortName = lookupLocationShortName;
//# sourceMappingURL=azure-location-shortname-lookup.js.map