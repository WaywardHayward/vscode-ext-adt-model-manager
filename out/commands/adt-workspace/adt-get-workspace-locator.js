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
exports.getWorkspaceLocatorForFile = exports.getWorkspaceLocator = void 0;
const path_1 = require("path");
const vscode_1 = require("vscode");
function getWorkspaceLocator(directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let adtLocatorPath = vscode_1.Uri.file(`${directoryPath}\\.adt-workspace`);
            let documentBytes = yield vscode_1.workspace.openTextDocument(adtLocatorPath);
            let text = documentBytes.getText();
            return JSON.parse(text.toString());
        }
        catch (ex) {
            console.error(ex);
        }
    });
}
exports.getWorkspaceLocator = getWorkspaceLocator;
function getWorkspaceLocatorForFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return getWorkspaceLocator(path_1.dirname(filePath.fsPath));
    });
}
exports.getWorkspaceLocatorForFile = getWorkspaceLocatorForFile;
//# sourceMappingURL=adt-get-workspace-locator.js.map