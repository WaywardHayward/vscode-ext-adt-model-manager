import { window } from "vscode";


export async function ConfirmAction(message:string ){
    var selection = await window
    .showInformationMessage(
       message,
        ...["Yes", "No"]
    );
    return selection == "Yes";
}