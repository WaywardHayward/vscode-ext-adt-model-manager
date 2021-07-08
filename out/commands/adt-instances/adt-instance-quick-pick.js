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
const adt_instance_lookup_api_1 = require("./adt-instance-lookup-api");
const adt_instance_export_models_1 = require("../adt-models/adt-instance-export-models");
function saveLocatorDetailsToWorkspace(instanceDetails) {
    if (!vscode_1.workspace.workspaceFolders) {
        return;
    }
    let twinWorkspace = vscode_1.Uri.joinPath(vscode_1.workspace.workspaceFolders[0].uri, instanceDetails.name);
    vscode_1.workspace.fs.createDirectory(twinWorkspace);
    if (instanceDetails) {
        let twinLocators = {
            url: instanceDetails.url,
            name: instanceDetails.name,
            auth: undefined,
            tenant: instanceDetails.tenant
        };
        vscode_1.workspace.fs.writeFile(vscode_1.Uri.joinPath(twinWorkspace, ".adt-workspace"), Buffer.from(JSON.stringify(twinLocators, null, "\t"), 'utf8'));
    }
}
function getAdtInstanceSelection(context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const api = vscode_1.extensions.getExtension('ms-vscode.azure-account').exports;
            const subscriptions = yield azure_sys_list_subscriptions_1.listSubscriptions();
            let instanceDetails = [];
            let instancePicks = [];
            for (var i = 0; i < subscriptions.length; i++) {
                let sub = subscriptions[i];
                try {
                    if (!(yield api.waitForLogin())) {
                        yield vscode_1.commands.executeCommand('azure-account.askForLogin');
                    }
                    console.log(`${sub.label} ${api.status}`);
                    const client = new arm_resources_1.ResourceManagementClient(sub.session.credentials2, (_a = sub.subscription.subscriptionId) !== null && _a !== void 0 ? _a : "");
                    vscode_1.window.setStatusBarMessage(`$(sync~spin) Looking for twins in ${sub.subscription.displayName}`);
                    var resources = yield client.resources.list({
                        filter: "resourceType eq 'Microsoft.DigitalTwins/digitalTwinsInstances'",
                        expand: "*"
                    });
                    if (!resources) {
                        continue;
                    }
                    resources.forEach(r => {
                        var _a, _b;
                        vscode_1.window.setStatusBarMessage(`Found ${r.name}`);
                        instanceDetails.push({
                            name: (_a = r.name) !== null && _a !== void 0 ? _a : "",
                            url: (_b = adt_instance_lookup_api_1.getAdtApiUrl(r.name, r.location)) !== null && _b !== void 0 ? _b : "",
                            auth: undefined,
                            tenant: sub.session.tenantId
                        });
                        instancePicks.push({
                            label: `$(symbol-class) ${r.name}`,
                            detail: `${sub.subscription.displayName}`
                        });
                    });
                }
                catch (ex) {
                    console.error(ex);
                }
            }
            vscode_1.window.setStatusBarMessage(`Found ${instancePicks.length} Twins`);
            if (instancePicks.length === 0) {
                return vscode_1.window.showErrorMessage("We were unable to find and Twin Instances");
            }
            var selectedItem = yield vscode_1.window.showQuickPick(instancePicks, {
                placeHolder: 'Select one of the twins below'
            });
            if (!selectedItem) {
                return;
            }
            let name = selectedItem.label.replace(/\$\(symbol-class\)/g, "").trim();
            vscode_1.window.showInformationMessage(`Selected ${name}`);
            let instanceDetail = instanceDetails.find((i) => {
                return i.name === name;
            });
            if (!instanceDetail) {
                return;
            }
            context.environmentVariableCollection.replace(constants.default.EnvironmentSettings.SelectedInstance, JSON.stringify(instanceDetail));
            saveLocatorDetailsToWorkspace(instanceDetail);
        }
        catch (ex) {
            vscode_1.window.showErrorMessage(ex);
            console.error(ex);
        }
        return;
    });
}
function adtInstanceQuickPick(context) {
    return __awaiter(this, void 0, void 0, function* () {
        yield vscode_1.window.withProgress({ title: `Azure Digital Twins: Loading Available Azure Digital Twin Instances`, location: vscode_1.ProgressLocation.Notification, }, () => getAdtInstanceSelection(context));
        yield adt_instance_export_models_1.adtInstanceExportModels(context);
    });
}
exports.adtInstanceQuickPick = adtInstanceQuickPick;
;
//# sourceMappingURL=adt-instance-quick-pick.js.map