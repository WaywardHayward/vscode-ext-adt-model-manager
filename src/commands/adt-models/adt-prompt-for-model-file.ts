import { Uri, window } from "vscode";



export async function promptForModelFile() : Promise<Uri|undefined> {
    let response = await window.showOpenDialog({
        canSelectMany: false,
        openLabel: 'Select Model to decommission',
        filters:{
            'Digital Twin Models': ['json', 'dtdl', 'dtdl.json']
        }
    });

    if(!response || response.length ===0)
    {
        return undefined;
    }

    return response[0];
}