import { DefaultAzureCredential, InteractiveBrowserCredential } from "@azure/identity";
import { dirname } from "path";
import { Uri, workspace } from "vscode";

export interface AdtWorkspaceLocator {
    name: string,
    url: string,
    auth: DefaultAzureCredential|undefined,
    tenant: string
}

export async function getWorkspaceLocator(directoryPath: string): Promise<undefined | AdtWorkspaceLocator> {
    try {
        let adtLocatorPath = Uri.file(`${directoryPath}\\.adt-workspace`);
        let documentBytes = await workspace.openTextDocument(adtLocatorPath);
        let text = documentBytes.getText();
        return JSON.parse(text.toString());
    } catch (ex) {
        console.error(ex);
    }
}

export async function getWorkspaceLocatorForFile(filePath: Uri) {
    return getWorkspaceLocator(dirname(filePath.fsPath));
}