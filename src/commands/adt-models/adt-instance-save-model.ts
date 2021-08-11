import { Uri, window, workspace } from "vscode";
import dtmiToFileName from "../../common/dtdl/DtmiToFileName";
import { handleAdtRequestError } from "../adt-common/adt-error-handler";


export async function saveModel(modelId: string, model: any, decomissioned: boolean, adtInstanceName: string): Promise<Uri | undefined> {

    if (workspace.workspaceFolders === undefined) {
        return undefined;
    }

    try {
        console.log(modelId);
        var modelFileName = `${dtmiToFileName(modelId)}.dtdl.json`;
        console.log(modelFileName);
        var directory = Uri.joinPath(workspace.workspaceFolders[0].uri, adtInstanceName);

        await workspace.fs.createDirectory(directory);
        if (decomissioned) {
            directory = Uri.joinPath(directory, ".decommissioned");
        }

        var path = Uri.joinPath(directory, modelFileName);
        console.log(`Saving ${modelId} to ${path.fsPath}`);
        await workspace.fs.writeFile(path, Buffer.from(JSON.stringify(model, null, "\t"), 'utf8'));
        return path;
    } catch (e) {
        await handleAdtRequestError(e, "saving model", undefined);
    }
    return undefined;
}