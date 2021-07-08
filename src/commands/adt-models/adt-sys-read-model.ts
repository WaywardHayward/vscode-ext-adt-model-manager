import path = require("path");
import * as vscode from "vscode";
import { Uri } from "vscode";

export interface AdtModelFile {
    name:string,
    path: Uri,
    model: any,
    modelId:string,
    modelVersion:number
}


export async function readModel(resource: Uri):Promise<AdtModelFile | undefined> {
    try
    {
        let path = resource.fsPath;
        vscode.window.setStatusBarMessage(`$(sync~spin) Reading model ${path}`);
        let document = await vscode.workspace.openTextDocument(Uri.file(path));
        let text = document.getText();

        let modelData = JSON.parse(text);
        let modelName = modelData.displayName;
        let modelId = modelData["@id"];
        let modelVersion = modelId.split(";")[1];

        return {
            path: resource,
            name: modelName,
            model:modelData,
            modelId:modelId,
            modelVersion:modelVersion
        };
    }catch(ex){
        console.error(ex);
        vscode.window.setStatusBarMessage(``);
        vscode.window.showErrorMessage(`Unable to parse model ${resource.fsPath} \n${ex}`);
        return undefined;
    }
}