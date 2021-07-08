import { DigitalTwinsClient } from '@azure/digital-twins-core';
import { dirname } from 'path';
import { ExtensionContext, Progress, ProgressLocation, Uri, window, workspace } from 'vscode';
import { getAuthenticatedAdtClient } from '../adt-authentication/adt-get-authenticated-client';
import { handleAdtRequestError } from '../adt-common/adt-error-handler';
import { AdtWorkspaceLocator, getWorkspaceLocatorForFile } from '../adt-workspace/adt-get-workspace-locator';
import { decomissionModel } from './adt-instance-decomission-model';
import { tryGetModel } from './adt-instance-try-get-model';
import { upgradeModelReferences } from './adt-instance-upgrade-model-references';
import { incrementModelVersion } from './adt-model-increment-version';
import { promptForModelFile } from './adt-prompt-for-model-file';
import { readModel } from './adt-sys-read-model';



async function tryUploadModel(resource: Uri, adtInstance: AdtWorkspaceLocator, client: DigitalTwinsClient) {

  try {

    let modelData = await readModel(resource);

    if (!modelData) {
      console.error(`Unable to read ${resource.fsPath}`);
      return;
    }

    let modelName = modelData.name;
    let modelVersion = modelData.modelVersion;

    await window.withProgress({ title: `Uploading model ${modelName} Version ${modelVersion} to ${adtInstance.name}`, location: ProgressLocation.Notification }, () => client.createModels([modelData?.model]));
    window.showInformationMessage(`Uploaded model ${modelName} Version ${modelVersion} to ${adtInstance.name}`);
  }
  catch (exception) {
    return handleAdtRequestError(exception, `Upload Model`, adtInstance);
  } finally {
    window.setStatusBarMessage(``);
  }

}

export async function adtInstanceUploadModel(resource: Uri, context: ExtensionContext, autoUpgrade: boolean, client:DigitalTwinsClient|undefined) {

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


  let modelData = await readModel(resource);

  if (!modelData) {
    return;
  }

  let modelName = modelData.name;
  let modelVersion = modelData.modelVersion;
  
  let cli = client ??  getAuthenticatedAdtClient(locator);


  try {
    window.setStatusBarMessage(`Checking for model ${modelName} exists`);

    var existingModel = await window.withProgress({ title: `Azure Digital Twin: Checking if ${modelName} version ${modelVersion} already exists`, location: ProgressLocation.Notification }, () => tryGetModel(modelData?.modelId ?? "", cli));

    if (existingModel) {

      let selection: string | undefined = "Decommission";

      if (!autoUpgrade) {
        selection = await window
          .showInformationMessage(
            `Model with Id ${modelData.modelId} already exists what do you want to do?`,
            ...["Increment & Decommission", "Cancel"]
          );
      }


      if (selection?.indexOf("Decommission") === -1) {
        return window.showInformationMessage("Upload Canceled");
      }

      let newResource = await incrementModelVersion(resource, cli);
      await workspace.fs.writeFile(resource, Buffer.from(JSON.stringify(existingModel.model, null, "\t"), 'utf8'));
      await tryUploadModel(newResource, locator, cli);
      await upgradeModelReferences(modelData.modelId, newResource, locator, context, client);
      await decomissionModel(resource, context, false, client);

    }
  }
  catch (ex) {
    if (ex.statusCode !== 404) {
      return handleAdtRequestError(ex, `Upload Model`, locator);
    }
  }

}

function buildReferenceList(allModels: any[], modelId: string, referenceTree: string[]) {

  referenceTree.push(modelId);

  let referencingModels = allModels.filter(r => r.extends === modelId);

  if (referencingModels.length === 0) {
    return referenceTree;
  }



  for(let i = 0; i < referencingModels.length; i++ ){
    let refs = buildReferenceList(allModels, referencingModels[i]["@id"], referenceTree);
    for(let y = 0; y < refs.length; y++){
      referenceTree.push(refs[y]);
    }

  }
    
  return referenceTree;

}


async function upgradeReferencingTwinInstances(resource: Uri, locator: AdtWorkspaceLocator | undefined, client: DigitalTwinsClient, progress: Progress<any>) {

  if (!locator) {
    return;
  }

  let model = await readModel(resource);
  let modelId = model?.modelId;


  let twinCounResult = await client.queryTwins(`SELECT COUNT() FROM DigitalTwins where $metadata.$model == '${modelId}'`);
  let twinCount = 0;

  for await (const count of twinCounResult) {
    twinCount = count;
  }

  progress.report({ message: `Upgrading ${twinCount} twins`, increment: 0 });

  var twins = await client.queryTwins(`SELECT $dtId FROM DigitalTwins where $metadata.$model == '${modelId}'`);
  let twinNumber = 0;
  for await (const twinId of twins) {

    await client.updateDigitalTwin(twinId.toString(), {
      "$metadata": {
        "$model": modelId
      }
    });

    twinNumber++;

    progress.report({ message: `Upgrading ${twinCount} twins`, increment: twinNumber / twinCount * 100 });
  }

}


