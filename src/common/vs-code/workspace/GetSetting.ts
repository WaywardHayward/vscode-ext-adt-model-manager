import { ExtensionContext } from "vscode";



export async function getWorkspaceSetting(context: ExtensionContext, key: string){
    return context.environmentVariableCollection.get(key)?.value;
}