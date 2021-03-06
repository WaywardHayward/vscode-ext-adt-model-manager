

export function lookupLocationShortName(location: string|undefined) {
    if(!location){
        return undefined;
    }

    switch (location.toLowerCase())
    {
        case 'eastus': return "eus";
        case 'eastus2': return "eus2";
        case 'northeurope': return 'neu';
        case 'southcentralus': return 'scus';
        case 'westcentralus': return 'wcus';
        case 'westus2': return 'wus2';
        case 'westeurope': return 'weu';
        case 'uksouth': return 'uks';
    }

    return location;
}