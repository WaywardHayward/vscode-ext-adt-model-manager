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
exports.getSelectedAdtInstance = void 0;
const adt_manager_constants_1 = require("../../adt-manager-constants");
const adt_instance_quick_pick_1 = require("./adt-instance-quick-pick");
function getSelectedAdtInstance(context) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let adtInstanceValue = (_a = context.environmentVariableCollection.get(adt_manager_constants_1.default.EnvironmentSettings.SelectedInstance)) === null || _a === void 0 ? void 0 : _a.value;
        if (adtInstanceValue === undefined) {
            yield adt_instance_quick_pick_1.adtInstanceQuickPick(context);
            adtInstanceValue = (_c = (_b = context.environmentVariableCollection.get(adt_manager_constants_1.default.EnvironmentSettings.SelectedInstance)) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : '';
        }
        if (adtInstanceValue) {
            return JSON.parse(adtInstanceValue);
        }
        return undefined;
    });
}
exports.getSelectedAdtInstance = getSelectedAdtInstance;
//# sourceMappingURL=adt-sys-get-selected-instance.js.map