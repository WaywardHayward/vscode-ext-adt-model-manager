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
exports.IncrementModelVersion = void 0;
const vscode = require("vscode");
const DtmiToFileName_1 = require("../../common/dtdl/DtmiToFileName");
function IncrementModelVersion(resource, context) {
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
            modelData["@id"] = `${modelId.split(";")[0]};${modelVersion}`;
            console.log(`Replace ${DtmiToFileName_1.DtmiToFileName(modelId)} with ${DtmiToFileName_1.DtmiToFileName(modelData["@id"])}`);
            var newPath = vscode.Uri.parse(resource.path.replace(DtmiToFileName_1.DtmiToFileName(modelId), DtmiToFileName_1.DtmiToFileName(modelData["@id"])));
            vscode.window.setStatusBarMessage(`Azure Digital Twin: Incrementing ${modelName} Version to ${modelVersion}`);
            vscode.workspace.fs.writeFile(newPath, Buffer.from(JSON.stringify(modelData, null, "\t"), 'utf8'));
            vscode.window.setStatusBarMessage(``);
            return newPath;
        }
        catch (ex) {
            vscode.window.showErrorMessage(`Failed to increment model version ${ex}`);
            throw ex;
        }
    });
}
exports.IncrementModelVersion = IncrementModelVersion;
//# sourceMappingURL=adt-model-increment-version.js.map