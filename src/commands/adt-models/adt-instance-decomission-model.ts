import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { fstat } from "fs";
import { dirname } from "path";
import { cachedDataVersionTag } from "v8";
import * as vscode from "vscode";
import { Uri } from "vscode";
import { ConfirmAction } from "../../common/vs-code/ConfirmAction";
import { getAuthenticatedAdtClient } from "../adt-authentication/adt-get-authenticated-client";
import { handleAdtRequestError } from "../adt-common/adt-error-handler";
import { AdtWorkspaceLocator, getWorkspaceLocatorForFile } from "../adt-workspace/adt-get-workspace-locator";
import { saveModel } from "./adt-instance-save-model";
import { promptForModelFile } from "./adt-prompt-for-model-file";
import { AdtModelFile, readModel } from "./adt-sys-read-model";

async function executeDecomissioning(modelId: string, locator: AdtWorkspaceLocator, client: DigitalTwinsClient | undefined) {
    try {

        let cli = client ??  getAuthenticatedAdtClient(locator);
        await vscode.window.withProgress({ title: `Azure Digital Twin: Decomissioning Model ${modelId}`, location: vscode.ProgressLocation.Notification }, () => cli.decomissionModel(modelId));
        vscode.window.showInformationMessage(`${modelId} Decommissioned`);
        
    } catch (ex) {
        return handleAdtRequestError(ex, `decommission model ${modelId}`, locator);
    }
}


export async function decomissionModel(resource: Uri, context: vscode.ExtensionContext, checkFirst: boolean, client: DigitalTwinsClient | undefined) {
    try {

        if (!resource) {
            var promptResponse = await promptForModelFile();
            if (!promptResponse) {
                return;
            }
            resource = promptResponse;
        }

        let locator = await getWorkspaceLocatorForFile(resource);

        if (!locator) {
            vscode.window.showErrorMessage(`The directory:${dirname(resource.fsPath)} is not an adt workspace`);
            return;
        }

        let path = resource.fsPath;
        vscode.window.setStatusBarMessage(`Validating model ${path}`);
        let modelData = await readModel(resource);

        if (!modelData) {
            return;
        }

        vscode.window.setStatusBarMessage(`Decommissioning Model ${modelData.name}`);
        if (!checkFirst || await ConfirmAction(`Are you sure you want to Decomission Model ${modelData.modelId}?`)) {
            await executeDecomissioning(modelData.modelId, locator, client);
            await moveModelFileToDecomissioned(modelData, locator.name, resource);
        }

    } catch (ex) {
        console.error(ex);
    }
}

async function moveModelFileToDecomissioned(model: AdtModelFile, adtInstance:string ,originalfile: vscode.Uri) {
    await saveModel(model.modelId, model.model, true, adtInstance);    
    await vscode.workspace.fs.delete(originalfile);
}
