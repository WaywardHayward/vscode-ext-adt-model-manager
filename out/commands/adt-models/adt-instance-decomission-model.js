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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decomissionModel = void 0;
const path_1 = require("path");
const vscode = require("vscode");
const ConfirmAction_1 = require("../../common/vs-code/ConfirmAction");
const adt_get_authenticated_client_1 = require("../adt-authentication/adt-get-authenticated-client");
const adt_error_handler_1 = require("../adt-common/adt-error-handler");
const adt_get_workspace_locator_1 = require("../adt-workspace/adt-get-workspace-locator");
const adt_instance_save_model_1 = require("./adt-instance-save-model");
const adt_prompt_for_model_file_1 = require("./adt-prompt-for-model-file");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function executeDecomissioning(modelId, locator, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let cli = client !== null && client !== void 0 ? client : adt_get_authenticated_client_1.getAuthenticatedAdtClient(locator);
            yield vscode.window.withProgress({ title: `Azure Digital Twin: Decomissioning Model ${modelId}`, location: vscode.ProgressLocation.Notification }, () => cli.decomissionModel(modelId));
            vscode.window.showInformationMessage(`${modelId} Decommissioned`);
        }
        catch (ex) {
            return adt_error_handler_1.handleAdtRequestError(ex, `decommission model ${modelId}`, locator);
        }
    });
}
function decomissionModel(resource, context, checkFirst, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!resource) {
                var promptResponse = yield adt_prompt_for_model_file_1.promptForModelFile();
                if (!promptResponse) {
                    return;
                }
                resource = promptResponse;
            }
            let locator = yield adt_get_workspace_locator_1.getWorkspaceLocatorForFile(resource);
            if (!locator) {
                vscode.window.showErrorMessage(`The directory:${path_1.dirname(resource.fsPath)} is not an adt workspace`);
                return;
            }
            let path = resource.fsPath;
            vscode.window.setStatusBarMessage(`Validating model ${path}`);
            let modelData = yield adt_sys_read_model_1.readModel(resource);
            if (!modelData) {
                return;
            }
            vscode.window.setStatusBarMessage(`Decommissioning Model ${modelData.name}`);
            if (!checkFirst || (yield ConfirmAction_1.ConfirmAction(`Are you sure you want to Decomission Model ${modelData.modelId}?`))) {
                yield executeDecomissioning(modelData.modelId, locator, client);
                yield moveModelFileToDecomissioned(modelData, locator.name, resource);
            }
        }
        catch (ex) {
            console.error(ex);
        }
    });
}
exports.decomissionModel = decomissionModel;
function moveModelFileToDecomissioned(model, adtInstance, originalfile) {
    return __awaiter(this, void 0, void 0, function* () {
        yield adt_instance_save_model_1.saveModel(model.modelId, model.model, true, adtInstance);
        yield vscode.workspace.fs.delete(originalfile);
    });
}
//# sourceMappingURL=adt-instance-decomission-model.js.map