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
exports.readModel = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
function readModel(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let path = resource.fsPath;
            vscode.window.setStatusBarMessage(`$(sync~spin) Reading model ${path}`);
            let document = yield vscode.workspace.openTextDocument(vscode_1.Uri.file(path));
            let text = document.getText();
            let modelData = JSON.parse(text);
            let modelName = modelData.displayName;
            let modelId = modelData["@id"];
            let modelVersion = modelId.split(";")[1];
            return {
                path: resource,
                name: modelName,
                model: modelData,
                modelId: modelId,
                modelVersion: modelVersion
            };
        }
        catch (ex) {
            console.error(ex);
            vscode.window.setStatusBarMessage(``);
            vscode.window.showErrorMessage(`Unable to parse model ${resource.fsPath} \n${ex}`);
            return undefined;
        }
    });
}
exports.readModel = readModel;
//# sourceMappingURL=adt-sys-read-model.js.map