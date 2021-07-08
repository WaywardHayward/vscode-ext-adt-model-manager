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
exports.adtInstanceQuickPick = void 0;
const arm_resources_1 = require("@azure/arm-resources");
const vscode_1 = require("vscode");
const constants = require("../../adt-manager-constants");
const azure_sys_list_subscriptions_1 = require("../azure/azure-sys-list-subscriptions");
function saveLocatorDetailsToWorkspace(name, instanceDetails) {
    if (!vscode_1.workspace.workspaceFolders) {
        return;
    }
    let twinWorkspace = vscode_1.Uri.joinPath(vscode_1.workspace.workspaceFolders[0].uri, name);
    vscode_1.workspace.fs.createDirectory(twinWorkspace);
    let instanceDetail = instanceDetails.filter((i) => {
        return i.name === name;
    });
    if (instanceDetail.length > 0) {
        let twinLocators = {
            subscriptionId: instanceDetail[0].subscription.subscriptionId,
            name: instanceDetail[0].name
        };
        vscode_1.workspace.fs.writeFile(vscode_1.Uri.joinPath(twinWorkspace, ".adt"), Buffer.from(JSON.stringify(twinLocators, null, "\t"), 'utf8'));
    }
}
function adtInstanceQuickPick(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            vscode_1.window.showInformationMessage('$(sync~spin) Loading Azure Digital Twin Instances');
            const subscriptions = yield azure_sys_list_subscriptions_1.listSubscriptions();
            const api = vscode_1.extensions.getExtension('ms-vscode.azure-account').exports;
            let instanceDetails = [];
            let instancePicks = [];
            for (const session of api.sessions) {
                const credentials = session.credentials2;
                for (var i = 0; i < subscriptions.length; i++) {
                    let sub = subscriptions[i];
                    const client = new arm_resources_1.ResourceManagementClient(credentials, (_a = sub.subscription.subscriptionId) !== null && _a !== void 0 ? _a : "");
                    vscode_1.window.setStatusBarMessage(`$(sync~spin) Looking for twins in ${sub.subscription.displayName}`);
                    try {
                        var resources = yield client.resources.list();
                        if (resources) {
                            resources.forEach(r => {
                                var _a;
                                if (r.id && ((_a = r.id) === null || _a === void 0 ? void 0 : _a.indexOf("/Microsoft.DigitalTwins/digitalTwinsInstances")) > -1) {
                                    vscode_1.window.setStatusBarMessage(`Found ${r.name}`);
                                    instanceDetails.push({
                                        name: r.name,
                                        subscription: sub.subscription
                                    });
                                    instancePicks.push({
                                        label: `$(symbol-class) ${r.name}`,
                                        detail: `${sub.subscription.displayName}`
                                    });
                                }
                            });
                        }
                    }
                    catch (ex) {
                        console.error(ex);
                    }
                }
            }
            vscode_1.window.setStatusBarMessage(`Found ${instancePicks.length} Twins`);
            var selectedItem = yield vscode_1.window.showQuickPick(instancePicks, {
                placeHolder: 'Select one of the twins below'
            });
            if (!selectedItem) {
                return yield adtInstanceQuickPick(context);
            }
            let name = selectedItem.label.replace(/\$\(symbol-class\)/g, "").trim();
            vscode_1.window.showInformationMessage(`Selecting ${name}`);
            context.environmentVariableCollection.replace(constants.default.EnvironmentSettings.SelectedInstance, name);
            saveLocatorDetailsToWorkspace(name, instanceDetails);
        }
        catch (ex) {
            console.error(ex);
            vscode_1.window.showErrorMessage(ex);
        }
        return;
    });
}
exports.adtInstanceQuickPick = adtInstanceQuickPick;
;
//# sourceMappingURL=adt-instance-quick-pick.js.map