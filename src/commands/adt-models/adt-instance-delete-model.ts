import { dirname } from "path";
import { ProgressLocation, Uri, window, workspace } from "vscode";
import { ConfirmAction } from "../../common/vs-code/ConfirmAction";
import { getAuthenticatedAdtClient } from "../adt-authentication/adt-get-authenticated-client";
import { handleAdtRequestError } from "../adt-common/adt-error-handler";
import { getWorkspaceLocatorForFile } from "../adt-workspace/adt-get-workspace-locator";
import { promptForModelFile } from "./adt-prompt-for-model-file";
import { readModel } from "./adt-sys-read-model";


export async function deleteModel(resource: Uri) {

  if (!resource) {
    var promptResponse = await promptForModelFile();
    if (!promptResponse) {
      return;
    }
    resource = promptResponse;
  }

  let locator = await getWorkspaceLocatorForFile(resource);

  if (!locator) {
    window.showErrorMessage(`The directory:${dirname(resource.fsPath)} is not an adt workspace`);
    return;
  }

  let path = resource.fsPath;
  window.setStatusBarMessage(`Validating model ${path}`);
  let modelData = await readModel(resource);

  if(!modelData)
  {
      return;
  }

  let modelName = modelData.name;
  let modelId = modelData.modelId;

  if (!await ConfirmAction(`Are you sure you want to Delete Model ${modelId}?`)) {
    return;
  }

  window.setStatusBarMessage(`Deleting Model ${modelName}`);
  let client = getAuthenticatedAdtClient(locator);
  try {
    window.withProgress({ title: `Azure Digital Twin: Deleting Model ${modelId}`, location: ProgressLocation.Notification }, () => client.deleteModel(modelId));
    workspace.fs.delete(resource);
    window.showInformationMessage(`Deleted ${modelId} Successfully`);
  } catch (ex) {
    return handleAdtRequestError(ex,`Delete model ${modelId}`, locator);
  }
}