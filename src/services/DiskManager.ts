import { IDiskManager } from "./IDiskManager";
import { IParsedData } from "../data/IParsedData";
import fs = require("fs");
import { ParsedCoursesData } from "../data/ParsedCoursesData";

export class DiskManager implements IDiskManager {
    // Constant
    private DIRNAME: string = "Database";
    private FILEDIR: string = "./" + this.DIRNAME + "/";

    public async initialize(): Promise<void> {
        // Check if database directory already exists
        const dirs: string[] = await fs.promises.readdir("./");
        if (!dirs.includes(this.DIRNAME)) {
            // Makes new directory if it does not already exist
            await fs.promises.mkdir(this.FILEDIR);
        }
    }

    public async saveDataset(dataset: IParsedData): Promise<void> {
        // Convert IParsedData into a nice JSON
        const dataAsJSON: string = JSON.stringify(dataset);
        // Save JSON into a .txt file
        // Note that saveDataset should not be called more than once
        // before promise returns
        await fs.promises.writeFile(this.FILEDIR + dataset.id, dataAsJSON);
    }

    // this may not be the most effecient implementation
    public async deleteDataset(id: string): Promise<void> {
        // Make sure file not already in dataset
        const fileNames: string[] = await fs.promises.readdir(this.FILEDIR);
        if (fileNames.includes(id)) {
            throw new Error("Cannot delete file with id: " + id + " because it does not exist");
        }
        // Delete file
        fs.promises.unlink(this.FILEDIR);
    }

    public async getDatasets(): Promise<IParsedData[]> {
        const fileNames: string[] = await fs.promises.readdir(this.FILEDIR);
        let foundData: IParsedData[] = [];
        // Terminate early if no datasets to get
        if (fileNames === undefined || fileNames.length === 0) {
            return Promise.resolve([]);
        }
        for (const file of fileNames) {
            foundData.push(JSON.parse((await fs.promises.readFile(this.FILEDIR)).toString()));
        }
        return foundData;
    }
}
