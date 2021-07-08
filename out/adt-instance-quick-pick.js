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
exports.AdtInstanceQuickPick = void 0;
const vscode = require("vscode");
const cp = require("child_process");
function AdtInstanceQuickPick() {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage('Loading Azure Digital Twin Instances');
        console.log("Loading Digital Twin Instances: az dt list");
        cp.exec('az dt list', (err, stdout, stderr) => __awaiter(this, void 0, void 0, function* () {
            console.log("Found " + stdout);
            let instances = JSON.parse(stdout);
            let instanceNames = [];
            instances.map((instance, items) => {
                instanceNames.push(instance.name);
                return items;
            }, []);
            const result = yield vscode.window.showQuickPick(instanceNames, {
                placeHolder: 'Select one of the twins below',
                onDidSelectItem: item => vscode.window.showInformationMessage(`Selecting ${item}`)
            });
        }));
    });
}
exports.AdtInstanceQuickPick = AdtInstanceQuickPick;
;
//# sourceMappingURL=adt-instance-quick-pick.js.map