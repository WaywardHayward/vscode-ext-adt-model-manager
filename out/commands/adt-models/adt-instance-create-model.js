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
exports.createModel = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
const DtmiToFileName_1 = require("../../common/dtdl/DtmiToFileName");
const adt_get_workspace_locator_1 = require("../adt-workspace/adt-get-workspace-locator");
function createModel(resource) {
    return __awaiter(this, void 0, void 0, function* () {
        let locator = yield adt_get_workspace_locator_1.getWorkspaceLocatorForFile(resource);
        if (!locator) {
            vscode_1.window.showErrorMessage(`The directory:${path_1.dirname(resource.fsPath)} is not an adt workspace`);
            return;
        }
        let newModelName = yield vscode_1.window.showInputBox({
            title: "Please Enter a New Model Display Name"
        });
        if (!newModelName) {
            return;
        }
        let newModelId = yield vscode_1.window.showInputBox({
            title: "Please Enter a New Model Id (without version number) ",
            value: `$dtmi:com:mynamespace:${newModelName === null || newModelName === void 0 ? void 0 : newModelName.replace(/ /g, ":").toLowerCase()}`
        });
        if (!newModelId) {
            return;
        }
        newModelId = `${newModelId};1`;
        var newModel = {
            "@id": newModelId,
            "@type": "Interface",
            "displayName": newModelName,
            "extends": newModelId,
            "@context": [
                "dtmi:dtdl:context;2"
            ],
            "contents": []
        };
        console.log(newModelId);
        let fileName = DtmiToFileName_1.default(newModelId);
        console.log(fileName);
        let file = vscode_1.Uri.file(`${path_1.dirname(resource.fsPath)}\\${fileName}.dtdl.json`);
        yield vscode_1.workspace.fs.writeFile(file, Buffer.from(JSON.stringify(newModel, null, "\t"), 'utf8'));
        let doc = yield vscode_1.workspace.openTextDocument(file);
        vscode_1.window.showTextDocument(doc);
    });
}
exports.createModel = createModel;
//# sourceMappingURL=adt-instance-create-model.js.map