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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adtInstanceExportModels = void 0;
const vscode = require("vscode");
const adt_sys_get_selected_instance_1 = require("../adt-instances/adt-sys-get-selected-instance");
const vscode_1 = require("vscode");
const adt_get_authenticated_client_1 = require("../adt-authentication/adt-get-authenticated-client");
const adt_error_handler_1 = require("../adt-common/adt-error-handler");
const adt_instance_save_model_1 = require("./adt-instance-save-model");
function importModelsFromInstance(adtInstance, context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!adtInstance) {
            adtInstance = yield adt_sys_get_selected_instance_1.getSelectedAdtInstance(context);
        }
        if (!adtInstance) {
            return;
        }
        if (!vscode.workspace.workspaceFolders) {
            return vscode.window.showInformationMessage('No folder or workspace opened');
        }
        yield vscode_1.window.withProgress({ title: `Azure Digital Twin: Downloading models from ${adtInstance.name}`, location: vscode.ProgressLocation.Notification }, () => downloadModels(adtInstance));
    });
}
function downloadModels(adtInstance) {
    var e_1, _a;
    var _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!adtInstance) {
            return;
        }
        try {
            let client = adt_get_authenticated_client_1.getAuthenticatedAdtClient(adtInstance);
            var models = yield client.listModels(undefined, true);
            let modelCount = 0;
            try {
                for (var models_1 = __asyncValues(models), models_1_1; models_1_1 = yield models_1.next(), !models_1_1.done;) {
                    const modelDefinition = models_1_1.value;
                    yield adt_instance_save_model_1.saveModel(modelDefinition.id, modelDefinition.model, (_b = modelDefinition.decommissioned) !== null && _b !== void 0 ? _b : false, adtInstance.name);
                    modelCount++;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (models_1_1 && !models_1_1.done && (_a = models_1.return)) yield _a.call(models_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            vscode_1.window.showInformationMessage(`Found ${modelCount} models in ${adtInstance.name}`);
        }
        catch (ex) {
            return adt_error_handler_1.handleAdtRequestError(ex, `Import models`, adtInstance);
        }
        vscode_1.window.setStatusBarMessage('');
    });
}
function adtInstanceExportModels(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield importModelsFromInstance(yield adt_sys_get_selected_instance_1.getSelectedAdtInstance(context), context);
    });
}
exports.adtInstanceExportModels = adtInstanceExportModels;
//# sourceMappingURL=adt-instance-export-models.js.map