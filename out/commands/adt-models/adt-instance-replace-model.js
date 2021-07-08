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
exports.replaceModel = void 0;
const vscode_1 = require("vscode");
const adt_get_authenticated_client_1 = require("../adt-authentication/adt-get-authenticated-client");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function replaceModel(resource, adtInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        // upload model
        let modelData = yield adt_sys_read_model_1.readModel(resource);
        if (!modelData) {
            return;
        }
        let modelName = modelData.name;
        let modelVersion = modelData.modelVersion;
        let client = adt_get_authenticated_client_1.getAuthenticatedAdtClient(adtInstance);
        // delete existing model
        yield vscode_1.window.withProgress({ title: `Deleting model ${modelName} Version ${modelVersion} to ${adtInstance.name}`, location: vscode_1.ProgressLocation.Notification }, () => { var _a; return client.deleteModel((_a = modelData === null || modelData === void 0 ? void 0 : modelData.modelId) !== null && _a !== void 0 ? _a : ""); });
        yield vscode_1.window.withProgress({ title: `Uploading model ${modelName} Version ${modelVersion} to ${adtInstance.name}`, location: vscode_1.ProgressLocation.Notification }, () => client.createModels([modelData]));
        return vscode_1.window.showInformationMessage(`Model ${modelName} Uploaded`);
    });
}
exports.replaceModel = replaceModel;
//# sourceMappingURL=adt-instance-replace-model.js.map