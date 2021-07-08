import { dirname } from "path";
import { Uri, window, workspace } from "vscode";
import dtmiToFileName from "../../common/dtdl/DtmiToFileName";
import { getWorkspaceLocatorForFile } from "../adt-workspace/adt-get-workspace-locator";


export async function createModel(resource: Uri) {

    let locator = await getWorkspaceLocatorForFile(resource);

    if (!locator) {

        window.showErrorMessage(`The directory:${dirname(resource.fsPath)} is not an adt workspace`);
        return;
    }

    let newModelName = await window.showInputBox({
        title: "Please Enter a New Model Display Name"
    });

    if (!newModelName) {
        return;
    }

    let newModelId = await window.showInputBox({
        title: "Please Enter a New Model Id (without version number) ",
        value: `$dtmi:com:mynamespace:${newModelName?.replace(/ /g, ":").toLowerCase()}`
    });

    if (!newModelId) {
        return;
    }

    newModelId= `${newModelId};1`;

    var newModel = {
        "@id": newModelId,
        "@type": "Interface",
        "displayName": newModelName,
        "extends": newModelId,
        "@context": [
            "dtmi:dtdl:context;2"
        ],
        "contents": []
    };

    console.log(newModelId);

    let fileName = dtmiToFileName(newModelId);

    console.log(fileName);

    let file = Uri.file(`${dirname(resource.fsPath)}\\${fileName}.dtdl.json`);
    await workspace.fs.writeFile(file, Buffer.from(JSON.stringify(newModel, null, "\t"), 'utf8'));
    let doc = await workspace.openTextDocument(file);
    window.showTextDocument(doc);
}