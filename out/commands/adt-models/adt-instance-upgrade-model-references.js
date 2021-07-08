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
exports.upgradeModelReferences = void 0;
const vscode_1 = require("vscode");
const adt_get_authenticated_client_1 = require("../adt-authentication/adt-get-authenticated-client");
const adt_error_handler_1 = require("../adt-common/adt-error-handler");
const adt_instance_save_model_1 = require("./adt-instance-save-model");
const adt_instance_upload_model_1 = require("./adt-instance-upload-model");
const adt_sys_read_model_1 = require("./adt-sys-read-model");
function upgradeModelReferences(fromModelId, toModel, locator, context, client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client) {
            client = adt_get_authenticated_client_1.getAuthenticatedAdtClient(locator);
        }
        console.log(`reading new Model from ${toModel.fsPath}`);
        let newModel = yield adt_sys_read_model_1.readModel(toModel);
        if (!newModel) {
            console.log(`New Model Not Found`);
            return;
        }
        yield upgradeModels(fromModelId, newModel, client, locator, context);
        yield upgradeTwins(fromModelId, newModel, client, locator);
    });
}
exports.upgradeModelReferences = upgradeModelReferences;
function upgradeModels(fromModelId, newModel, client, locator, context) {
    var e_1, _a;
    var _b;
    return __awaiter(this, void 0, void 0, function* () {
        console.log("loading referencingModels");
        let models = yield client.listModels(undefined, true);
        try {
            for (var models_1 = __asyncValues(models), models_1_1; models_1_1 = yield models_1.next(), !models_1_1.done;) {
                const modelDefinition = models_1_1.value;
                if (vscode_1.workspace.workspaceFolders === undefined) {
                    return;
                }
                if (modelDefinition.decommissioned || modelDefinition.id === fromModelId) {
                    continue;
                }
                let modelExtends = modelDefinition.model["extends"];
                if (modelExtends === modelDefinition.id || modelExtends !== fromModelId) {
                    console.log("Cannot extend root model");
                    continue;
                }
                console.log(`found ${modelDefinition.id}`);
                console.log(`upgrading ${modelDefinition.id} to extend ${newModel.modelId}`);
                modelDefinition.model["extends"] = newModel.modelId;
                console.log(`New Model now extends ${modelDefinition.model["extends"]}`);
                let path = yield adt_instance_save_model_1.saveModel(modelDefinition.id, modelDefinition.model, (_b = modelDefinition.decommissioned) !== null && _b !== void 0 ? _b : false, locator.name);
                if (path) {
                    yield adt_instance_upload_model_1.adtInstanceUploadModel(path, context, true, client);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (models_1_1 && !models_1_1.done && (_a = models_1.return)) yield _a.call(models_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function upgradeTwins(fromModelId, newModel, client, locator) {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function* () {
        let twins = yield client.queryTwins(`SELECT * FROM DigitalTwins WHERE $metadata.$model = '${fromModelId}'`);
        try {
            for (var twins_1 = __asyncValues(twins), twins_1_1; twins_1_1 = yield twins_1.next(), !twins_1_1.done;) {
                const twin = twins_1_1.value;
                console.log(`Found Twin ${twin}`);
                let twinId = twin["$dtId"];
                try {
                    yield client.updateDigitalTwin(twinId, [{ "op": "replace", "path": "/$metadata/$model", "value": newModel.modelId }]);
                }
                catch (ex) {
                    adt_error_handler_1.handleAdtRequestError(ex, `Updating twin ${twinId} to ${newModel.modelId}`, locator);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (twins_1_1 && !twins_1_1.done && (_a = twins_1.return)) yield _a.call(twins_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    });
}
//# sourceMappingURL=adt-instance-upgrade-model-references.js.map