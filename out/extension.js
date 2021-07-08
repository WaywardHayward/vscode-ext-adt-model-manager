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
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const adt_instance_export_models_1 = require("./commands/adt-models/adt-instance-export-models");
const adt_instance_quick_pick_1 = require("./commands/adt-instances/adt-instance-quick-pick");
const adt_instance_upload_model_1 = require("./commands/adt-models/adt-instance-upload-model");
const adt_instance_decomission_model_1 = require("./commands/adt-models/adt-instance-decomission-model");
const adt_instance_delete_model_1 = require("./commands/adt-models/adt-instance-delete-model");
const adt_instance_extend_model_1 = require("./commands/adt-models/adt-instance-extend-model");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "Azure Digital Twin Manager" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let adtconnect = vscode.commands.registerCommand('adtmanager.connect', () => __awaiter(this, void 0, void 0, function* () { return yield adt_instance_quick_pick_1.adtInstanceQuickPick(context); }));
    let adtImportModels = vscode.commands.registerCommand('adtmanager.models.export', () => __awaiter(this, void 0, void 0, function* () { return yield adt_instance_export_models_1.adtInstanceExportModels(context); }));
    let adtUploadModels = vscode.commands.registerCommand('adtmanager.models.upload', (resource) => __awaiter(this, void 0, void 0, function* () { return yield adt_instance_upload_model_1.adtInstanceUploadModel(resource, context, false, undefined); }));
    let adtDecomissionModel = vscode.commands.registerCommand('adtmanager.models.decomission', (resource) => __awaiter(this, void 0, void 0, function* () { return yield adt_instance_decomission_model_1.decomissionModel(resource, context, true, undefined); }));
    let adtDeleteModel = vscode.commands.registerCommand('adtmanager.models.delete', (resource) => __awaiter(this, void 0, void 0, function* () { return yield adt_instance_delete_model_1.deleteModel(resource); }));
    let adtExtendModel = vscode.commands.registerCommand('adtmanager.models.extend', (resource) => __awaiter(this, void 0, void 0, function* () { return yield adt_instance_extend_model_1.extendModel(resource); }));
    let adtCreateModel = vscode.commands.registerCommand('adtmanager.models.create', (resource) => __awaiter(this, void 0, void 0, function* () { return yield adt_instance_extend_model_1.extendModel(resource); }));
    context.subscriptions.push(adtconnect);
    context.subscriptions.push(adtImportModels);
    context.subscriptions.push(adtUploadModels);
    context.subscriptions.push(adtDecomissionModel);
    context.subscriptions.push(adtDeleteModel);
    context.subscriptions.push(adtExtendModel);
    context.subscriptions.push(adtCreateModel);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map