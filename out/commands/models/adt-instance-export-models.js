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
exports.adtInstanceExportModels = void 0;
const vscode = require("vscode");
const adt_sys_get_selected_instance_1 = require("../instances/adt-sys-get-selected-instance");
const vscode_1 = require("vscode");
const shell_1 = require("../../common/shell");
const DtmiToFileName_1 = require("../../common/dtdl/DtmiToFileName");
function exportModels(adtInstance, context) {
    return __awaiter(this, void 0, void 0, function* () {
        let command = `az dt model list -n ${adtInstance} --definition`;
        vscode_1.window.setStatusBarMessage(`Azure Digital Twin: Downloading models from ${adtInstance}`);
        var result = yield shell_1.ExecShell(command);
        let models = JSON.parse(result);
        if (!vscode.workspace.workspaceFolders) {
            return vscode.window.showInformationMessage('No folder or workspace opened');
        }
        models.forEach((modelDefinition) => __awaiter(this, void 0, void 0, function* () {
            if (vscode.workspace.workspaceFolders === undefined) {
                return;
            }
            var modelFileName = `${DtmiToFileName_1.DtmiToFileName(modelDefinition.id)}.dtdl.json`;
            var directory = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, adtInstance);
            var path = vscode.Uri.joinPath(directory, modelFileName);
            vscode.workspace.fs.createDirectory(directory);
            console.log(path);
            vscode.workspace.fs.writeFile(path, Buffer.from(JSON.stringify(modelDefinition.model, null, "\t"), 'utf8'));
            vscode.workspace.openTextDocument(path).then(doc => {
                vscode.window.showTextDocument(doc);
            });
        }));
        vscode_1.window.setStatusBarMessage('');
        vscode_1.window.showInformationMessage(`Found ${models.length} models in ${adtInstance}`);
    });
}
function adtInstanceExportModels(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exportModels(yield adt_sys_get_selected_instance_1.getSelectedAdtInstance(context), context);
    });
}
exports.adtInstanceExportModels = adtInstanceExportModels;
//# sourceMappingURL=adt-instance-export-models.js.map