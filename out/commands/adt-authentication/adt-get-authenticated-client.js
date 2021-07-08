"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthenticatedAdtClient = void 0;
const digital_twins_core_1 = require("@azure/digital-twins-core");
const identity_1 = require("@azure/identity");
const vscode_1 = require("vscode");
function getAuthenticatedAdtClient(addtLocator) {
    vscode_1.window.setStatusBarMessage(`$(sync~spin) Azure Digital Twin: Connecting to ${addtLocator.url}`);
    let cred = new identity_1.VisualStudioCodeCredential({ tenantId: addtLocator.tenant });
    return new digital_twins_core_1.DigitalTwinsClient(addtLocator.url, cred);
}
exports.getAuthenticatedAdtClient = getAuthenticatedAdtClient;
//# sourceMappingURL=adt-get-authenticated-client.js.map