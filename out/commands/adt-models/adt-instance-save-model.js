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
exports.saveModel = void 0;
const vscode_1 = require("vscode");
const DtmiToFileName_1 = require("../../common/dtdl/DtmiToFileName");
function saveModel(modelId, model, decomissioned, adtInstanceName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (vscode_1.workspace.workspaceFolders === undefined) {
            return undefined;
        }
        var modelFileName = `${DtmiToFileName_1.default(modelId)}.dtdl.json`;
        var directory = vscode_1.Uri.joinPath(vscode_1.workspace.workspaceFolders[0].uri, adtInstanceName);
        yield vscode_1.workspace.fs.createDirectory(directory);
        if (decomissioned) {
            directory = vscode_1.Uri.joinPath(directory, ".decommissioned");
        }
        var path = vscode_1.Uri.joinPath(directory, modelFileName);
        console.log(`Saving ${modelId} to ${path.fsPath}`);
        yield vscode_1.workspace.fs.writeFile(path, Buffer.from(JSON.stringify(model, null, "\t"), 'utf8'));
        return path;
    });
}
exports.saveModel = saveModel;
//# sourceMappingURL=adt-instance-save-model.js.map