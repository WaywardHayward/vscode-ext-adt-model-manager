import { ResourceManagementClient } from '@azure/arm-resources';
import { commands, ExtensionContext, extensions, ProgressLocation, QuickPickItem, Uri, window, workspace } from 'vscode';
import { AzureAccount } from "../azure/azure-account.api";
import * as constants from "../../adt-manager-constants";
import { listSubscriptions, SubscriptionItem } from '../azure/azure-sys-list-subscriptions';
import { AdtWorkspaceLocator } from '../adt-workspace/adt-get-workspace-locator';
import { getAdtApiUrl } from './adt-instance-lookup-api';
import { adtInstanceExportModels } from '../adt-models/adt-instance-export-models';


function saveLocatorDetailsToWorkspace(instanceDetails: AdtWorkspaceLocator) {
    if (!workspace.workspaceFolders) {
        return;
    }

    let twinWorkspace = Uri.joinPath(workspace.workspaceFolders[0].uri, instanceDetails.name);

    workspace.fs.createDirectory(twinWorkspace);

    if (instanceDetails) {


        let twinLocators: AdtWorkspaceLocator = {
            url: instanceDetails.url,
            name: instanceDetails.name,
            auth: undefined,
            tenant: instanceDetails.tenant
        };

        workspace.fs.writeFile(Uri.joinPath(twinWorkspace, ".adt-workspace"), Buffer.from(JSON.stringify(twinLocators, null, "\t"), 'utf8'));

    }
}

async function getAdtInstanceSelection(context: ExtensionContext) {
    try {

        const api = extensions.getExtension<AzureAccount>('ms-vscode.azure-account')!.exports;
        const subscriptions: Array<SubscriptionItem> = await listSubscriptions();

        let instanceDetails: AdtWorkspaceLocator[] = [];
        let instancePicks: QuickPickItem[] = [];

        for (var i = 0; i < subscriptions.length; i++) {

            let sub = subscriptions[i];

            try {

                if (!(await api.waitForLogin())) {
                    await commands.executeCommand('azure-account.askForLogin');
                }

                console.log(`${sub.label} ${api.status}`);


                const client = new ResourceManagementClient(sub.session.credentials2, sub.subscription.subscriptionId ?? "");

                window.setStatusBarMessage(`$(sync~spin) Looking for twins in ${sub.subscription.displayName}`);


                var resources = await client.resources.list({
                    filter: "resourceType eq 'Microsoft.DigitalTwins/digitalTwinsInstances'",
                    expand: "*"
                });

                if (!resources) {
                    continue;
                }

                resources.forEach(r => {

                    window.setStatusBarMessage(`Found ${r.name}`);

                    instanceDetails.push({
                        name: r.name ?? "",
                        url: getAdtApiUrl(r.name, r.location) ?? "",
                        auth: undefined,
                        tenant: sub.session.tenantId
                    });

                    instancePicks.push({
                        label: `$(symbol-class) ${r.name}`,
                        detail: `${sub.subscription.displayName}`
                    });
                });
            } catch (ex) {
                console.error(ex);
            }
        }

        window.setStatusBarMessage(`Found ${instancePicks.length} Twins`);

        if (instancePicks.length === 0) {
            return window.showErrorMessage("We were unable to find and Twin Instances");
        }

        var selectedItem = await window.showQuickPick(instancePicks, {
            placeHolder: 'Select one of the twins below'
        });

        if (!selectedItem) {
            return;
        }

        let name = selectedItem.label.replace(/\$\(symbol-class\)/g, "").trim();
        window.showInformationMessage(`Selected ${name}`);

        let instanceDetail: AdtWorkspaceLocator | undefined = instanceDetails.find((i) => {
            return i.name === name;
        });

        if (!instanceDetail) {
            return;
        }

        context.environmentVariableCollection.replace(constants.default.EnvironmentSettings.SelectedInstance, JSON.stringify(instanceDetail));
        saveLocatorDetailsToWorkspace(instanceDetail);


    } catch (ex) {
        window.showErrorMessage(ex);
        console.error(ex);
    }
    return;
}

export async function adtInstanceQuickPick(context: ExtensionContext): Promise<any> {
    await window.withProgress({ title: `Azure Digital Twins: Loading Available Azure Digital Twin Instances`, location: ProgressLocation.Notification, }, () => getAdtInstanceSelection(context));
    await adtInstanceExportModels(context);
};