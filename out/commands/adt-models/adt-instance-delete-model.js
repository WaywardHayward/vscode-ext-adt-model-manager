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
exports.deleteModel = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
const ConfirmAction_1 = require("../../common/vs-code/ConfirmAction");
const adt_get_authenticated_client_1 = require("../adt-authentication/adt-get-authenticated-client");
const adt_error_handler_1 = require("../adt-common/adt-error-handler");
const adt_get_workspace_locator_1 = require("../adt-workspace/adt-get-workspace-locator");
const adt_prompt_for_model_file_1 = require("./adt-prompt-for-model-file");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function deleteModel(resource) {
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
        let path = resource.fsPath;
        vscode_1.window.setStatusBarMessage(`Validating model ${path}`);
        let modelData = yield adt_sys_read_model_1.readModel(resource);
        if (!modelData) {
            return;
        }
        let modelName = modelData.name;
        let modelId = modelData.modelId;
        if (!(yield ConfirmAction_1.ConfirmAction(`Are you sure you want to Delete Model ${modelId}?`))) {
            return;
        }
        vscode_1.window.setStatusBarMessage(`Deleting Model ${modelName}`);
        let client = adt_get_authenticated_client_1.getAuthenticatedAdtClient(locator);
        try {
            vscode_1.window.withProgress({ title: `Azure Digital Twin: Deleting Model ${modelId}`, location: vscode_1.ProgressLocation.Notification }, () => client.deleteModel(modelId));
            vscode_1.workspace.fs.delete(resource);
            vscode_1.window.showInformationMessage(`Deleted ${modelId} Successfully`);
        }
        catch (ex) {
            return adt_error_handler_1.handleAdtRequestError(ex, `Delete model ${modelId}`, locator);
        }
    });
}
exports.deleteModel = deleteModel;
//# sourceMappingURL=adt-instance-delete-model.js.map