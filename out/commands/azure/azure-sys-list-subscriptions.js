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
exports.listSubscriptions = void 0;
const vscode_1 = require("vscode");
const arm_subscriptions_1 = require("@azure/arm-subscriptions");
function listSubscriptions() {
    return __awaiter(this, void 0, void 0, function* () {
        const api = vscode_1.extensions.getExtension('ms-vscode.azure-account').exports;
        if (!(yield api.waitForLogin())) {
            yield vscode_1.commands.executeCommand('azure-account.askForLogin');
        }
        return loadSubscriptionItems(api);
    });
}
exports.listSubscriptions = listSubscriptions;
function loadSubscriptionItems(api) {
    return __awaiter(this, void 0, void 0, function* () {
        yield api.waitForFilters();
        const subscriptionItems = [];
        for (const session of api.sessions) {
            try {
                const credentials = session.credentials2;
                const subscriptionClient = new arm_subscriptions_1.SubscriptionClient(credentials);
                const subscriptions = yield listAll(subscriptionClient.subscriptions, subscriptionClient.subscriptions.list());
                subscriptionItems.push(...subscriptions.map(subscription => ({
                    label: subscription.displayName || '',
                    description: subscription.subscriptionId || '',
                    session,
                    subscription
                })));
            }
            catch (ex) {
                console.log(`error loging subscription for session ${session.userId}`);
            }
        }
        subscriptionItems.sort((a, b) => a.label.localeCompare(b.label));
        return subscriptionItems;
    });
}
function listAll(client, first) {
    return __awaiter(this, void 0, void 0, function* () {
        const all = [];
        for (let list = yield first; list.length || list.nextLink; list = list.nextLink ? yield client.listNext(list.nextLink) : []) {
            all.push(...list);
        }
        return all;
    });
}
//# sourceMappingURL=azure-sys-list-subscriptions.js.map