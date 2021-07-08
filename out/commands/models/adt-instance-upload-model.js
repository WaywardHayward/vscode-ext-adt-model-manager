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
exports.adtInstanceUploadModel = void 0;
const vscode = require("vscode");
const shell_1 = require("../../common/shell");
const adt_sys_get_selected_instance_1 = require("../instances/adt-sys-get-selected-instance");
const adt_instance_decomission_model_1 = require("./adt-instance-decomission-model");
const adt_model_increment_version_1 = require("./adt-model-increment-version");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function adtInstanceUploadModel(resource, context) {
    return __awaiter(this, void 0, void 0, function* () {
        let modelData = yield adt_sys_read_model_1.ReadModel(resource);
        let adtInstance = yield adt_sys_get_selected_instance_1.getSelectedAdtInstance(context);
        let modelName = modelData.displayName;
        let modelId = modelData["@id"];
        let modelVersion = modelId.split(";")[1];
        let path = resource.fsPath;
        try {
            vscode.window.setStatusBarMessage(`Checking for model ${modelName} exists`);
            var existingModel = JSON.parse(yield shell_1.ExecShell(`az dt model show -n ${adtInstance} --dtmi "${modelId}"`));
            if (existingModel) {
                var selection = yield vscode.window
                    .showInformationMessage(`Model with Id ${modelId} already exists what do you want to do?`, ...["Increment Model Version & Decomission the old model", "Increment the Model Version", "Cancel"]);
                if ((selection === null || selection === void 0 ? void 0 : selection.indexOf("Decomission")) !== -1) {
                    yield adt_instance_decomission_model_1.decomissionModel(resource, context, false);
                }
                if ((selection === null || selection === void 0 ? void 0 : selection.indexOf("Increment Model")) !== -1) {
                    path = (yield adt_model_increment_version_1.IncrementModelVersion(resource, context)).fsPath;
                }
            }
        }
        catch (ex) {
            let exString = ex.toString();
            if (exString.indexOf("ERROR: {'error': {'code':") === -1) {
                return vscode.window.showErrorMessage(ex);
            }
            let adtErrorString = exString.replace(/'/g, '\"').replace("ERROR: ", "");
            let adtError = JSON.parse(adtErrorString.split("\n")[1]);
            if (adtError.error.code !== 'ModelNotFound') {
                return vscode.window.showErrorMessage(adtError.error.message);
            }
        }
        vscode.window.setStatusBarMessage(`Uploading model ${modelName} Version ${modelVersion} to ${adtInstance}`);
        try {
            yield shell_1.ExecShell(`az dt model create -n ${adtInstance} --models ${path} --debug`);
            vscode.window.showInformationMessage(`Uploaded model ${modelName} Version ${modelVersion} to ${adtInstance}`);
        }
        catch (exception) {
            console.error(exception);
            vscode.window.showErrorMessage(`Error Uploading model ${modelName} to ${adtInstance}: ${exception}`);
        }
        vscode.window.setStatusBarMessage(``);
    });
}
exports.adtInstanceUploadModel = adtInstanceUploadModel;
//# sourceMappingURL=adt-instance-upload-model.js.map