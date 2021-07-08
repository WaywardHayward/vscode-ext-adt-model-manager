import { ExtensionContext, ProgressLocation, Uri, window } from "vscode";
import { getAuthenticatedAdtClient } from "../adt-authentication/adt-get-authenticated-client";
import { AdtWorkspaceLocator } from "../adt-workspace/adt-get-workspace-locator";
import { readModel } from "./adt-sys-read-model";



export async function replaceModel(resource: Uri, adtInstance: AdtWorkspaceLocator) {

    // upload model
    let modelData = await readModel(resource);

    if (!modelData) {
        return;
    }

    let modelName = modelData.name;
    let modelVersion = modelData.modelVersion;
    let client = getAuthenticatedAdtClient(adtInstance);

    // delete existing model
    await window.withProgress({ title: `Deleting model ${modelName} Version ${modelVersion} to ${adtInstance.name}`, location: ProgressLocation.Notification }, () => client.deleteModel(modelData?.modelId??""));
    await window.withProgress({ title: `Uploading model ${modelName} Version ${modelVersion} to ${adtInstance.name}`, location: ProgressLocation.Notification }, () => client.createModels([modelData]));

    return window.showInformationMessage(`Model ${modelName} Uploaded`);

}