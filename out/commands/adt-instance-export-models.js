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
exports.AdtInstanceExportModels = void 0;
const cp = require("child_process");
const adt_manager_constants_1 = require("../adt-manager-constants");
const adt_instance_quick_pick_1 = require("./adt-instance-quick-pick");
function ExportModels(adtInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        let command = `az dt model list -n ${adtInstance} --definition`;
        console.log(`Executing Command:${command}`);
        cp.exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                console.error(stderr);
                return;
            }
            console.log(stdout);
            let models = JSON.parse(stdout);
            models.array.forEach((modelDefinition) => {
                console.log(modelDefinition);
            });
        });
    });
}
function AdtInstanceExportModels(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let adtInstance = (_a = context.environmentVariableCollection.get(adt_manager_constants_1.default.EnvironmentSettings.SelectedInstance)) === null || _a === void 0 ? void 0 : _a.value;
        if (adtInstance == undefined) {
            yield adt_instance_quick_pick_1.AdtInstanceQuickPick(context).then(() => {
                var _a, _b;
                let selectedInstance = (_b = (_a = context.environmentVariableCollection.get(adt_manager_constants_1.default.EnvironmentSettings.SelectedInstance)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '';
                ExportModels(selectedInstance);
            });
        }
        else {
            yield ExportModels(adtInstance);
        }
    });
}
exports.AdtInstanceExportModels = AdtInstanceExportModels;
//# sourceMappingURL=adt-instance-export-models.js.map