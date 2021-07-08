import { DigitalTwinsClient } from '@azure/digital-twins-core';
import { dirname } from 'path';
import * as vscode from 'vscode';
import { Uri } from 'vscode';
import dtmiToFileName from '../../common/dtdl/DtmiToFileName';
import { tryGetModel } from './adt-instance-try-get-model';

export async function incrementModelVersion(resource: vscode.Uri, client:DigitalTwinsClient) {
    try {
        let path = resource.fsPath;
        vscode.window.setStatusBarMessage(`Validating model ${path}`);
        let document = await vscode.workspace.openTextDocument(path);
        let text = document.getText();
        let modelData = JSON.parse(text);
        let modelName = modelData.displayName;
        let modelId = modelData["@id"];
        let modelVersion = Number.parseInt(modelId.split(";")[1]) + 1;
        let newModelId = `${modelId.split(";")[0]};${modelVersion}`;

        let model = await tryGetModel(newModelId, client);
        
        while(model){
            modelVersion++;
            newModelId = `${modelId.split(";")[0]};${modelVersion}`;
            model = await tryGetModel(newModelId, client);
        }

        modelData["@id"] = newModelId;
        console.log(`Replace ${dtmiToFileName(modelId)} with ${dtmiToFileName(modelData["@id"])}`);
        var newPath = Uri.joinPath(Uri.parse(dirname(resource.path)), `${dtmiToFileName(newModelId)}.dtdl.json` );
        console.log(`New File ${newPath.fsPath}`);
        vscode.window.setStatusBarMessage(`Azure Digital Twin: Incrementing ${modelName} Version to ${modelVersion}`);
        await vscode.workspace.fs.writeFile(newPath, Buffer.from(JSON.stringify(modelData, null, "\t"), 'utf8'));
        vscode.window.setStatusBarMessage(``);
        
        return newPath;
    } catch (ex) {
        console.error(ex);
        vscode.window.showErrorMessage(`Unable to increment model version for model at path ${resource.fsPath}  \n${ex}`);
        throw ex;
    }
}