import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { ExtensionContext, tasks, Uri, workspace } from "vscode";
import { getAuthenticatedAdtClient } from "../adt-authentication/adt-get-authenticated-client";
import { handleAdtRequestError } from "../adt-common/adt-error-handler";
import { AdtWorkspaceLocator } from "../adt-workspace/adt-get-workspace-locator";
import { saveModel } from "./adt-instance-save-model";
import { adtInstanceUploadModel } from "./adt-instance-upload-model";
import { AdtModelFile, readModel } from "./adt-sys-read-model";



export async function upgradeModelReferences(fromModelId: string, toModel: Uri, locator: AdtWorkspaceLocator, context:ExtensionContext, client:DigitalTwinsClient|undefined) {
    
    if(!client){
        client = getAuthenticatedAdtClient(locator);
    }

    console.log(`reading new Model from ${toModel.fsPath}`);
    let newModel = await readModel(toModel);
    
    if(!newModel)
    {
        console.log(`New Model Not Found`);
        return;
    }

    
    await upgradeModels(fromModelId, newModel, client, locator, context);
    await upgradeTwins(fromModelId, newModel, client, locator);

}

async function upgradeModels(fromModelId: string, newModel:AdtModelFile, client:DigitalTwinsClient, locator: AdtWorkspaceLocator,  context:ExtensionContext){
    
    console.log("loading referencingModels");
    let models = await client.listModels(undefined, true);

    for await (const modelDefinition of models) {

        if (workspace.workspaceFolders === undefined) {
            return;
        }
      
        if (modelDefinition.decommissioned || modelDefinition.id === fromModelId) {
            continue;
        }

        let modelExtends = modelDefinition.model["extends"];

        if(modelExtends === modelDefinition.id || modelExtends !== fromModelId)
        {
            console.log("Cannot extend root model");
            continue;
        }

        console.log(`found ${modelDefinition.id}`);
        console.log(`upgrading ${modelDefinition.id} to extend ${newModel.modelId}`);
        modelDefinition.model["extends"] = newModel.modelId;
        console.log(`New Model now extends ${modelDefinition.model["extends"]}`);
        let path = await saveModel(modelDefinition.id, modelDefinition.model, modelDefinition.decommissioned ?? false, locator.name);
        if (path) {
            await adtInstanceUploadModel(path, context, true, client );
        }

    }
}

async function upgradeTwins(fromModelId: string, newModel: AdtModelFile, client: DigitalTwinsClient, locator: AdtWorkspaceLocator) {
    
    let twins = await client.queryTwins(`SELECT * FROM DigitalTwins WHERE $metadata.$model = '${fromModelId}'`);

    for await (const twin of twins) {
        console.log(`Found Twin ${twin}`);
        let twinId = twin["$dtId"];
        try
        {
            await client.updateDigitalTwin(twinId, [{ "op": "replace", "path": "/$metadata/$model", "value": newModel.modelId }]);
        }catch(ex){
            handleAdtRequestError(ex, `Updating twin ${twinId} to ${newModel.modelId}`, locator);
        }
    }


}
