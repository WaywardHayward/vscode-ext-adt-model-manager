import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { DefaultAzureCredential, DeviceCodeCredential, getDefaultAzureCredential, InteractiveBrowserCredential, VisualStudioCodeCredential } from "@azure/identity";
import { window } from "vscode";
import { AdtWorkspaceLocator } from "../adt-workspace/adt-get-workspace-locator";
import { setLogLevel } from "@azure/logger";


export function getAuthenticatedAdtClient(addtLocator: AdtWorkspaceLocator): DigitalTwinsClient {
    setLogLevel("info");
    window.setStatusBarMessage(`$(sync~spin) Azure Digital Twin: Connecting to ${addtLocator.url}`);
    let cred = new VisualStudioCodeCredential({ tenantId: addtLocator.tenant});

    return new DigitalTwinsClient(addtLocator.url, cred, {
        redirectOptions: {
            handleRedirects: true
        }
    });
}