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
const shell_1 = require("../../common/shell");
const ConfirmAction_1 = require("../../common/vs-code/ConfirmAction");
const adt_sys_get_selected_instance_1 = require("../instances/adt-sys-get-selected-instance");
const adt_prompt_for_model_file_1 = require("./adt-prompt-for-model-file");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function executeDecomissioning(modelId, adtInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        let command = `az dt model update -n ${adtInstance} --dtmi "${modelId}" --decommission`;
        yield shell_1.ExecShell(command);
        vscode.window.showInformationMessage(`${modelId} Decomissioned`);
    });
}
function decomissionModel(resource, context, checkFirst) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!resource) {
                var promptResponse = yield adt_prompt_for_model_file_1.promptForModelFile();
                if (!promptResponse) {
                    return;
                }
                resource = promptResponse;
            }
            let directory = path_1.dirname(resource.fsPath);
            vscode.window.showInformationMessage(directory);
            return;
            let path = resource.fsPath;
            vscode.window.setStatusBarMessage(`Validating model ${path}`);
            let modelData = yield adt_sys_read_model_1.ReadModel(resource);
            let adtInstance = yield adt_sys_get_selected_instance_1.getSelectedAdtInstance(context);
            let modelName = modelData.displayName;
            let modelId = modelData["@id"];
            vscode.window.setStatusBarMessage(`Decomissioning Model ${modelName}`);
            if (!checkFirst || (yield ConfirmAction_1.ConfirmAction(`Are you sure you want to Decomission Model ${modelId}?`))) {
                yield executeDecomissioning(modelId, adtInstance);
            }
        }
        catch (ex) {
            console.error(ex);
        }
    });
}
exports.decomissionModel = decomissionModel;
//# sourceMappingURL=adt-instance-decomission-model.js.map