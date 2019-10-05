import { IDiskManager } from "./IDiskManager";
import { IParsedData } from "../data/IParsedData";
import fs = require("fs");

export class DiskManager implements IDiskManager {
    // Constant
    private FILE: string = "./db.txt";

    public saveDataset(dataset: IParsedData): Promise<void> {
        // Convert IParsedData into a nice JSON
        const dataAsJSON: string = JSON.stringify(dataset);
        // Save JSON into a .txt file
        // Note that saveDataset should not be called more than once
        // before promise returns
        return new Promise ((resolve, reject) => {
            fs.writeFile(this.FILE, dataAsJSON, (err: any) => {
                if (err.isInstanceOf(Error)) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public deleteDataset(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    public getDatasets(): Promise<IParsedData[]> {
        throw new Error("Method not implemented.");
    }
}
