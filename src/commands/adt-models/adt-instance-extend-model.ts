import { dirname } from "path";
import { Uri, window, workspace } from "vscode";
import dtmiToFileName from "../../common/dtdl/DtmiToFileName";
import { readModel } from "./adt-sys-read-model";


export async function extendModel(resource: Uri) {
    try {
        let modelData = await readModel(resource);

        if(!modelData)
        {
            return;
        }

       
        let modelId = modelData.modelId;
        let cleanModelId = modelId.split(";")[0];

        let newModelName = await window.showInputBox({
            title: "Please Enter a New Model Display Name"
        });


        if (!newModelName) {
            return;
        }

        let newModelId = await window.showInputBox({
            title: "Please Enter a New Model Id (without version number) ",
            value: `${cleanModelId}:${newModelName?.replace(/ /g, ":").toLowerCase()}` 
        });

        if (!newModelId) {
            return;
        }

        newModelId= `${newModelId};1`;

        var newModel = {
            "@id": newModelId,
            "@type": "Interface",
            "displayName": newModelName,
            "extends": modelId,
            "@context": [
                "dtmi:dtdl:context;2"
            ],
            "contents": []
        };


        let fileName = dtmiToFileName(newModelId);
        let file = Uri.file(`${dirname(resource.fsPath)}\\${fileName}.dtdl.json`);
        await workspace.fs.writeFile(file, Buffer.from(JSON.stringify(newModel, null, "\t"), 'utf8'));
        let doc = await workspace.openTextDocument(file);
        window.showTextDocument(doc);
    } catch (ex) {
        window.showErrorMessage(ex);
    }
}