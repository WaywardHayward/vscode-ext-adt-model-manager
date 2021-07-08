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
exports.incrementModelVersion = void 0;
const path_1 = require("path");
const vscode = require("vscode");
const vscode_1 = require("vscode");
const DtmiToFileName_1 = require("../../common/dtdl/DtmiToFileName");
const adt_instance_try_get_model_1 = require("./adt-instance-try-get-model");
function incrementModelVersion(resource, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let path = resource.fsPath;
            vscode.window.setStatusBarMessage(`Validating model ${path}`);
            let document = yield vscode.workspace.openTextDocument(path);
            let text = document.getText();
            let modelData = JSON.parse(text);
            let modelName = modelData.displayName;
            let modelId = modelData["@id"];
            let modelVersion = Number.parseInt(modelId.split(";")[1]) + 1;
            let newModelId = `${modelId.split(";")[0]};${modelVersion}`;
            let model = yield adt_instance_try_get_model_1.tryGetModel(newModelId, client);
            while (model) {
                modelVersion++;
                newModelId = `${modelId.split(";")[0]};${modelVersion}`;
                model = yield adt_instance_try_get_model_1.tryGetModel(newModelId, client);
            }
            modelData["@id"] = newModelId;
            console.log(`Replace ${DtmiToFileName_1.default(modelId)} with ${DtmiToFileName_1.default(modelData["@id"])}`);
            var newPath = vscode_1.Uri.joinPath(vscode_1.Uri.parse(path_1.dirname(resource.path)), `${DtmiToFileName_1.default(newModelId)}.dtdl.json`);
            console.log(`New File ${newPath.fsPath}`);
            vscode.window.setStatusBarMessage(`Azure Digital Twin: Incrementing ${modelName} Version to ${modelVersion}`);
            yield vscode.workspace.fs.writeFile(newPath, Buffer.from(JSON.stringify(modelData, null, "\t"), 'utf8'));
            vscode.window.setStatusBarMessage(``);
            return newPath;
        }
        catch (ex) {
            console.error(ex);
            vscode.window.showErrorMessage(`Unable to increment model version for model at path ${resource.fsPath}  \n${ex}`);
            throw ex;
        }
    });
}
exports.incrementModelVersion = incrementModelVersion;
//# sourceMappingURL=adt-model-increment-version.js.map