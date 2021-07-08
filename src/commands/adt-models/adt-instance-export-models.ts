import * as vscode from 'vscode';
import { getSelectedAdtInstance } from '../adt-instances/adt-sys-get-selected-instance';
import { window } from 'vscode';
import dtmiToFileName from '../../common/dtdl/DtmiToFileName';
import { AdtWorkspaceLocator } from '../adt-workspace/adt-get-workspace-locator';
import { getAuthenticatedAdtClient } from '../adt-authentication/adt-get-authenticated-client';
import { handleAdtRequestError } from '../adt-common/adt-error-handler';
import { saveModel } from './adt-instance-save-model';

async function importModelsFromInstance(adtInstance: AdtWorkspaceLocator | undefined, context: vscode.ExtensionContext) {

    if (!adtInstance) {
        adtInstance = await getSelectedAdtInstance(context);
    }

    if (!adtInstance) {
        return;
    }

    if (!vscode.workspace.workspaceFolders) {
        return vscode.window.showInformationMessage('No folder or workspace opened');
    }

    await window.withProgress({ title: `Azure Digital Twin: Downloading models from ${adtInstance.name}`, location: vscode.ProgressLocation.Notification }, () => downloadModels(adtInstance));


}

async function downloadModels(adtInstance: AdtWorkspaceLocator | undefined) {

    if (!adtInstance) {
        return;
    }

    try {

        let client = getAuthenticatedAdtClient(adtInstance);
        var models = await client.listModels(undefined, true);
        let modelCount = 0;

        for await (const modelDefinition of models) {
            await saveModel(modelDefinition.id, modelDefinition.model, modelDefinition.decommissioned ?? false, adtInstance.name);
            modelCount++;
        }

        window.showInformationMessage(`Found ${modelCount} models in ${adtInstance.name}`);

    } catch (ex) {
        return handleAdtRequestError(ex, `Import models`, adtInstance);
    }

    window.setStatusBarMessage('');
        
}

export async function adtInstanceExportModels(context: vscode.ExtensionContext) {
    await importModelsFromInstance(await getSelectedAdtInstance(context), context);
}