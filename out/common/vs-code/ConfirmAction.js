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
exports.ConfirmAction = void 0;
const vscode_1 = require("vscode");
function ConfirmAction(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var selection = yield vscode_1.window
            .showInformationMessage(message, ...["Yes", "No"]);
        return selection == "Yes";
    });
}
exports.ConfirmAction = ConfirmAction;
//# sourceMappingURL=ConfirmAction.js.map