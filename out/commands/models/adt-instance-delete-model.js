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
const vscode_1 = require("vscode");
const shell_1 = require("../../common/shell");
const ConfirmAction_1 = require("../../common/vs-code/ConfirmAction");
const adt_sys_get_selected_instance_1 = require("../instances/adt-sys-get-selected-instance");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function deleteModel(resource, context) {
    return __awaiter(this, void 0, void 0, function* () {
        let path = resource.fsPath;
        vscode_1.window.setStatusBarMessage(`Validating model ${path}`);
        let modelData = yield adt_sys_read_model_1.ReadModel(resource);
        let adtInstance = yield adt_sys_get_selected_instance_1.getSelectedAdtInstance(context);
        let modelName = modelData.displayName;
        let modelId = modelData["@id"];
        if (!(yield ConfirmAction_1.ConfirmAction(`Are you sure you want to Delete Model ${modelId}?`))) {
            return;
        }
        vscode_1.window.setStatusBarMessage(`Deleting Model ${modelName}`);
        shell_1.ExecShell(`az dt model delete -n ${adtInstance} --dtmi "${modelId}"`);
        vscode_1.workspace.fs.delete(resource);
        vscode_1.window.showInformationMessage(`Deleted ${modelId} Successfully`);
    });
}
exports.deleteModel = deleteModel;
//# sourceMappingURL=adt-instance-delete-model.js.map