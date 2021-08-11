import { window } from "vscode";
import { AdtWorkspaceLocator } from "../adt-workspace/adt-get-workspace-locator";


export async function handleAdtRequestError(ex: any, actionName:string, adtInstance: AdtWorkspaceLocator | undefined) {
    window.setStatusBarMessage(``);
    console.error(ex);
    if (ex.name && ex.name === "RestError") {
        return handleAdtError(ex,actionName,  adtInstance);
    } else {
        return handleError(ex, actionName, adtInstance);
    }
}

function handleError(ex: any, actionName:string, adtInstance: AdtWorkspaceLocator | undefined) {
    return window.showErrorMessage(`Unable to ${actionName} ${adtInstance?.url} - \n${ex}`);
}
function handleAdtError(ex: any, actionName:string, adtInstance: AdtWorkspaceLocator | undefined) {

    if (ex.statusCode === 404) {
        window.showErrorMessage(`Unable to connect to ${adtInstance?.url} - not found  \n${ex}`);
    }

    if (ex.statusCode === 403) {
        window.showErrorMessage(`Unable to connect to ${adtInstance?.url} - forbidden  \n${ex}`);
    }

    if (ex.statusCode === 401) {
        window.showErrorMessage(`Unable to connect to ${adtInstance?.url} - not authorized  \n${ex}`);
    }

    return handleError(ex,actionName, adtInstance);

}

