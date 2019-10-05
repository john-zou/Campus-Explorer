import { IDiskManager } from "./IDiskManager";
import { IParsedData } from "../data/IParsedData";
import fs = require("fs");
import { ParsedCoursesData } from "../data/ParsedCoursesData";

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
                    return reject(err);
                } else {
                    return resolve();
                }
            });
        });
    }

    // this may not be the most effecient implmentation
    public async deleteDataset(id: string): Promise<void[]> {
        // Open disk datasets
        let alldatasets: IParsedData[] = await this.getDatasets();
        // Filter out dataset == to id (same as removeDataset)
        alldatasets = alldatasets.filter((dataset: IParsedData) => {
            return dataset.id === id;
        });
        const promises: Array<Promise<void>> = [];
        for (const d of alldatasets) {
            promises.push(this.saveDataset(d));
        }
        return Promise.all(promises);
    }

    public getDatasets(): Promise<IParsedData[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.FILE, (err: any, contents: Buffer) => {
                if (err.isInstanceOf(Error)) {
                    return reject(err);
                } else {
                    return this.bufferToIParsedData(contents);
                }
            });
        });
    }

    public bufferToIParsedData (buf: Buffer): IParsedData[] {
        let dataAsString: any = buf.toJSON();
        return;
    }
}
