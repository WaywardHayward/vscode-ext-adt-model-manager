import { window, ExtensionContext, commands, QuickPickItem, extensions } from 'vscode';
import { SubscriptionClient, SubscriptionModels } from '@azure/arm-subscriptions';
import { AzureAccount, AzureSession } from "./azure-account.api";

export interface SubscriptionItem {
    label: string;
    description: string;
    session: AzureSession;
    subscription: SubscriptionModels.Subscription;
}

export interface PartialList<T> extends Array<T> {
    nextLink?: string;
}

export async function listSubscriptions(): Promise<Array<SubscriptionItem>> {
    const api = extensions.getExtension<AzureAccount>('ms-vscode.azure-account')!.exports;
    if (!(await api.waitForLogin())) {
        await commands.executeCommand('azure-account.askForLogin');
    }

    return loadSubscriptionItems(api);
}


async function loadSubscriptionItems(api: AzureAccount) {
    await api.waitForFilters();
    const subscriptionItems: SubscriptionItem[] = [];

    for (const session of api.sessions) {
        try {
            const credentials = session.credentials2;
            const subscriptionClient = new SubscriptionClient(credentials);
            const subscriptions = await listAll(subscriptionClient.subscriptions, subscriptionClient.subscriptions.list());
            subscriptionItems.push(...subscriptions.map(subscription => ({
                label: subscription.displayName || '',
                description: subscription.subscriptionId || '',
                session,
                subscription
            })));
        } catch (ex) {
            console.log(`error loging subscription for session ${session.userId}`);
        }
    }
    subscriptionItems.sort((a, b) => a.label.localeCompare(b.label));
    return subscriptionItems;
}

async function listAll<T>(client: { listNext(nextPageLink: string): Promise<PartialList<T>>; }, first: Promise<PartialList<T>>): Promise<T[]> {
    const all: T[] = [];
    for (let list = await first; list.length || list.nextLink; list = list.nextLink ? await client.listNext(list.nextLink) : []) {
        all.push(...list);
    }
    return all;
}