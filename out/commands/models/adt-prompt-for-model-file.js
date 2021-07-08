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
exports.promptForModelFile = void 0;
const vscode_1 = require("vscode");
function promptForModelFile() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield vscode_1.window.showOpenDialog({
            canSelectMany: false,
            openLabel: 'Select Model to decommission',
            filters: {
                'Digital Twin Models': ['json', 'dtdl', 'dtdl.json']
            }
        });
        if (!response || response.length === 0) {
            return undefined;
        }
        return response[0];
    });
}
exports.promptForModelFile = promptForModelFile;
//# sourceMappingURL=adt-prompt-for-model-file.js.map