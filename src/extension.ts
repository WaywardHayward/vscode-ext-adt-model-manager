// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { adtInstanceExportModels } from './commands/adt-models/adt-instance-export-models';
import { adtInstanceQuickPick } from './commands/adt-instances/adt-instance-quick-pick';
import { adtInstanceUploadModel } from './commands/adt-models/adt-instance-upload-model';
import { decomissionModel } from './commands/adt-models/adt-instance-decomission-model';
import { deleteModel } from './commands/adt-models/adt-instance-delete-model';
import { extendModel } from './commands/adt-models/adt-instance-extend-model';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Azure Digital Twin Manager" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let adtconnect = vscode.commands.registerCommand('adtmanager.connect', async () => await adtInstanceQuickPick(context));
	let adtImportModels = vscode.commands.registerCommand('adtmanager.models.export', async () => await adtInstanceExportModels(context));
	let adtUploadModels = vscode.commands.registerCommand('adtmanager.models.upload', async (resource: vscode.Uri) => await adtInstanceUploadModel(resource, context, false, undefined));
	let adtDecomissionModel = vscode.commands.registerCommand('adtmanager.models.decomission', async (resource: vscode.Uri) => await decomissionModel(resource, context, true, undefined));
	let adtDeleteModel = vscode.commands.registerCommand('adtmanager.models.delete', async (resource: vscode.Uri) => await deleteModel(resource));
	let adtExtendModel = vscode.commands.registerCommand('adtmanager.models.extend', async (resource: vscode.Uri) => await extendModel(resource));
	let adtCreateModel = vscode.commands.registerCommand('adtmanager.models.create', async (resource: vscode.Uri) => await extendModel(resource));
	
	context.subscriptions.push(adtconnect);
	context.subscriptions.push(adtImportModels);
	context.subscriptions.push(adtUploadModels);
	context.subscriptions.push(adtDecomissionModel);
	context.subscriptions.push(adtDeleteModel);
	context.subscriptions.push(adtExtendModel);
	context.subscriptions.push(adtCreateModel);

}

// this method is called when your extension is deactivated
export function deactivate() {}
