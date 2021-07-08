"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adtInstanceUploadModel = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
const adt_get_authenticated_client_1 = require("../adt-authentication/adt-get-authenticated-client");
const adt_error_handler_1 = require("../adt-common/adt-error-handler");
const adt_get_workspace_locator_1 = require("../adt-workspace/adt-get-workspace-locator");
const adt_instance_decomission_model_1 = require("./adt-instance-decomission-model");
const adt_instance_try_get_model_1 = require("./adt-instance-try-get-model");
const adt_instance_upgrade_model_references_1 = require("./adt-instance-upgrade-model-references");
const adt_model_increment_version_1 = require("./adt-model-increment-version");
const adt_prompt_for_model_file_1 = require("./adt-prompt-for-model-file");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function tryUploadModel(resource, adtInstance, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelData = yield adt_sys_read_model_1.readModel(resource);
            if (!modelData) {
                console.error(`Unable to read ${resource.fsPath}`);
                return;
            }
            let modelName = modelData.name;
            let modelVersion = modelData.modelVersion;
            yield vscode_1.window.withProgress({ title: `Uploading model ${modelName} Version ${modelVersion} to ${adtInstance.name}`, location: vscode_1.ProgressLocation.Notification }, () => client.createModels([modelData === null || modelData === void 0 ? void 0 : modelData.model]));
            vscode_1.window.showInformationMessage(`Uploaded model ${modelName} Version ${modelVersion} to ${adtInstance.name}`);
        }
        catch (exception) {
            return adt_error_handler_1.handleAdtRequestError(exception, `Upload Model`, adtInstance);
        }
        finally {
            vscode_1.window.setStatusBarMessage(``);
        }
    });
}
function adtInstanceUploadModel(resource, context, autoUpgrade, client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!resource) {
            var promptResponse = yield adt_prompt_for_model_file_1.promptForModelFile();
            if (!promptResponse) {
                return;
            }
            resource = promptResponse;
        }
        let locator = yield adt_get_workspace_locator_1.getWorkspaceLocatorForFile(resource);
        if (!locator) {
            vscode_1.window.showErrorMessage(`The directory:${path_1.dirname(resource.fsPath)} is not an adt workspace`);
            return;
        }
        let modelData = yield adt_sys_read_model_1.readModel(resource);
        if (!modelData) {
            return;
        }
        let modelName = modelData.name;
        let modelVersion = modelData.modelVersion;
        let cli = client !== null && client !== void 0 ? client : adt_get_authenticated_client_1.getAuthenticatedAdtClient(locator);
        try {
            vscode_1.window.setStatusBarMessage(`Checking for model ${modelName} exists`);
            var existingModel = yield vscode_1.window.withProgress({ title: `Azure Digital Twin: Checking if ${modelName} version ${modelVersion} already exists`, location: vscode_1.ProgressLocation.Notification }, () => { var _a; return adt_instance_try_get_model_1.tryGetModel((_a = modelData === null || modelData === void 0 ? void 0 : modelData.modelId) !== null && _a !== void 0 ? _a : "", cli); });
            if (existingModel) {
                let selection = "Decommission";
                if (!autoUpgrade) {
                    selection = yield vscode_1.window
                        .showInformationMessage(`Model with Id ${modelData.modelId} already exists what do you want to do?`, ...["Increment & Decommission", "Cancel"]);
                }
                if ((selection === null || selection === void 0 ? void 0 : selection.indexOf("Decommission")) === -1) {
                    return vscode_1.window.showInformationMessage("Upload Canceled");
                }
                let newResource = yield adt_model_increment_version_1.incrementModelVersion(resource, cli);
                yield vscode_1.workspace.fs.writeFile(resource, Buffer.from(JSON.stringify(existingModel.model, null, "\t"), 'utf8'));
                yield tryUploadModel(newResource, locator, cli);
                yield adt_instance_upgrade_model_references_1.upgradeModelReferences(modelData.modelId, newResource, locator, context, client);
                yield adt_instance_decomission_model_1.decomissionModel(resource, context, false, client);
            }
        }
        catch (ex) {
            if (ex.statusCode !== 404) {
                return adt_error_handler_1.handleAdtRequestError(ex, `Upload Model`, locator);
            }
        }
    });
}
exports.adtInstanceUploadModel = adtInstanceUploadModel;
function buildReferenceList(allModels, modelId, referenceTree) {
    referenceTree.push(modelId);
    let referencingModels = allModels.filter(r => r.extends === modelId);
    if (referencingModels.length === 0) {
        return referenceTree;
    }
    for (let i = 0; i < referencingModels.length; i++) {
        let refs = buildReferenceList(allModels, referencingModels[i]["@id"], referenceTree);
        for (let y = 0; y < refs.length; y++) {
            referenceTree.push(refs[y]);
        }
    }
    return referenceTree;
}
function upgradeReferencingTwinInstances(resource, locator, client, progress) {
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!locator) {
            return;
        }
        let model = yield adt_sys_read_model_1.readModel(resource);
        let modelId = model === null || model === void 0 ? void 0 : model.modelId;
        let twinCounResult = yield client.queryTwins(`SELECT COUNT() FROM DigitalTwins where $metadata.$model == '${modelId}'`);
        let twinCount = 0;
        try {
            for (var twinCounResult_1 = __asyncValues(twinCounResult), twinCounResult_1_1; twinCounResult_1_1 = yield twinCounResult_1.next(), !twinCounResult_1_1.done;) {
                const count = twinCounResult_1_1.value;
                twinCount = count;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (twinCounResult_1_1 && !twinCounResult_1_1.done && (_a = twinCounResult_1.return)) yield _a.call(twinCounResult_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        progress.report({ message: `Upgrading ${twinCount} twins`, increment: 0 });
        var twins = yield client.queryTwins(`SELECT $dtId FROM DigitalTwins where $metadata.$model == '${modelId}'`);
        let twinNumber = 0;
        try {
            for (var twins_1 = __asyncValues(twins), twins_1_1; twins_1_1 = yield twins_1.next(), !twins_1_1.done;) {
                const twinId = twins_1_1.value;
                yield client.updateDigitalTwin(twinId.toString(), {
                    "$metadata": {
                        "$model": modelId
                    }
                });
                twinNumber++;
                progress.report({ message: `Upgrading ${twinCount} twins`, increment: twinNumber / twinCount * 100 });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (twins_1_1 && !twins_1_1.done && (_b = twins_1.return)) yield _b.call(twins_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
//# sourceMappingURL=adt-instance-upload-model.js.map