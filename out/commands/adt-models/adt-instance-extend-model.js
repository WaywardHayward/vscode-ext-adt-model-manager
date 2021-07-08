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
exports.extendModel = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
const DtmiToFileName_1 = require("../../common/dtdl/DtmiToFileName");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function extendModel(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelData = yield adt_sys_read_model_1.readModel(resource);
            if (!modelData) {
                return;
            }
            let modelId = modelData.modelId;
            let cleanModelId = modelId.split(";")[0];
            let newModelName = yield vscode_1.window.showInputBox({
                title: "Please Enter a New Model Display Name"
            });
            if (!newModelName) {
                return;
            }
            let newModelId = yield vscode_1.window.showInputBox({
                title: "Please Enter a New Model Id (without version number) ",
                value: `${cleanModelId}:${newModelName === null || newModelName === void 0 ? void 0 : newModelName.replace(/ /g, ":").toLowerCase()}`
            });
            if (!newModelId) {
                return;
            }
            newModelId = `${newModelId};1`;
            var newModel = {
                "@id": newModelId,
                "@type": "Interface",
                "displayName": newModelName,
                "extends": modelId,
                "@context": [
                    "dtmi:dtdl:context;2"
                ],
                "contents": []
            };
            let fileName = DtmiToFileName_1.default(newModelId);
            let file = vscode_1.Uri.file(`${path_1.dirname(resource.fsPath)}\\${fileName}.dtdl.json`);
            yield vscode_1.workspace.fs.writeFile(file, Buffer.from(JSON.stringify(newModel, null, "\t"), 'utf8'));
            let doc = yield vscode_1.workspace.openTextDocument(file);
            vscode_1.window.showTextDocument(doc);
        }
        catch (ex) {
            vscode_1.window.showErrorMessage(ex);
        }
    });
}
exports.extendModel = extendModel;
//# sourceMappingURL=adt-instance-extend-model.js.map