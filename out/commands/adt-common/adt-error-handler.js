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
exports.handleAdtRequestError = void 0;
const vscode_1 = require("vscode");
function handleAdtRequestError(ex, actionName, adtInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode_1.window.setStatusBarMessage(``);
        if (ex.name && ex.name === "RestError") {
            return handleAdtError(ex, actionName, adtInstance);
        }
        else {
            return handleError(ex, actionName, adtInstance);
        }
    });
}
exports.handleAdtRequestError = handleAdtRequestError;
function handleError(ex, actionName, adtInstance) {
    return vscode_1.window.showErrorMessage(`Unable to ${actionName} ${adtInstance === null || adtInstance === void 0 ? void 0 : adtInstance.url} - \n${ex}`);
}
function handleAdtError(ex, actionName, adtInstance) {
    if (ex.statusCode === 404) {
        vscode_1.window.showErrorMessage(`Unable to connect to ${adtInstance === null || adtInstance === void 0 ? void 0 : adtInstance.url} - not found  \n${ex}`);
    }
    if (ex.statusCode === 401) {
        vscode_1.window.showErrorMessage(`Unable to connect to ${adtInstance === null || adtInstance === void 0 ? void 0 : adtInstance.url} - not authorized  \n${ex}`);
    }
    return handleError(ex, actionName, adtInstance);
}
//# sourceMappingURL=adt-error-handler.js.map