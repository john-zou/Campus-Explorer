import { IDiskManager } from "./IDiskManager";
import { IParsedData } from "../data/IParsedData";

export class DiskManager implements IDiskManager {
    // Constructor creates disk .txt file
    // if it does not already exist
    public constructor() {
        // Check to see if file already exists
        throw new Error("Method not implemented.");
    }

    public saveDataset(dataset: IParsedData): Promise<void> {
        // Convert IParsedData into a nice JSON
        const dataAsJSON: string = JSON.stringify(dataset);
        // Save JSON into an (already existing) .txt file
        throw new Error("Method not implemented.");
    }

    public deleteDataset(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    public getDatasets(): Promise<IParsedData[]> {
        throw new Error("Method not implemented.");
    }
}
