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
exports.tryGetModel = void 0;
const vscode_1 = require("vscode");
function tryGetModel(modelId, client) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            vscode_1.window.setStatusBarMessage(`Requesting Model ${modelId}`);
            let model = yield client.getModel(modelId, true);
            return model;
        }
        catch (ex) {
            console.log(`Model ${modelId} not found`);
        }
        return undefined;
    });
}
exports.tryGetModel = tryGetModel;
//# sourceMappingURL=adt-instance-try-get-model.js.map