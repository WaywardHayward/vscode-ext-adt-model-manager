import * as vscode from 'vscode';
import adtManagerConstants from '../../adt-manager-constants';
import { AdtWorkspaceLocator } from '../adt-workspace/adt-get-workspace-locator';
import { adtInstanceQuickPick } from './adt-instance-quick-pick';


export async function getSelectedAdtInstance(context: vscode.ExtensionContext) :Promise<AdtWorkspaceLocator | undefined>{
    
    let adtInstanceValue = context.environmentVariableCollection.get(adtManagerConstants.EnvironmentSettings.SelectedInstance)?.value;

    if(adtInstanceValue === undefined){
        await adtInstanceQuickPick(context);
        adtInstanceValue = context.environmentVariableCollection.get(adtManagerConstants.EnvironmentSettings.SelectedInstance)?.value ?? '';
    }
    
    if(adtInstanceValue){
        return JSON.parse(adtInstanceValue);
    }

    return undefined;
}