import { DigitalTwinsClient } from "@azure/digital-twins-core";
import { window } from "vscode";


export async function tryGetModel(modelId: string, client: DigitalTwinsClient) :Promise<any|undefined> {
    try {
      window.setStatusBarMessage(`Requesting Model ${modelId}`);
      let model = await client.getModel(modelId, true);
      return model;
    } catch (ex) {
      console.log(`Model ${modelId} not found`);
    }
    return undefined;
  }