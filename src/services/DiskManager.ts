import { IDiskManager, DiskManagerStatus } from "./IDiskManager";
import { IParsedData } from "../data/IParsedData";
import fs = require("fs");
import { ParsedCoursesData } from "../data/ParsedCoursesData";
import Log from "../Util";
import { ActualDataset } from "../data/ActualDataset";

export class DiskManager implements IDiskManager {
    // Constant
    private DIRNAME: string = "data";
    private FILEDIR: string = "./" + this.DIRNAME + "/";

    public Status: DiskManagerStatus = DiskManagerStatus.NewlyBorn;

    /**
     * Creates the data folder if it's not already there
     */
    public async initializeIfNeeded(): Promise<void> {
        if (this.Status === DiskManagerStatus.Adult) {
            return;
        }
        // Check if database directory already exists
        const dirs: string[] =  fs.readdirSync("./");
        if (!dirs.includes(this.DIRNAME)) {
            // Makes new directory if it does not already exist
            fs.mkdirSync(this.FILEDIR);
            return;
        }
    }

    public async saveDataset(dataset: ActualDataset): Promise<void> {
        // Convert IParsedData into a nice JSON
        const dataAsJSON: string = JSON.stringify(dataset);
        // Save JSON into a .txt file
        // Note that saveDataset should not be called more than once
        // before promise returns
        fs.writeFileSync(this.FILEDIR + dataset.ID, dataAsJSON);
    }

    // this may not be the most effecient implementation
    public async deleteDataset(id: string): Promise<void> {
        // Make sure file not already in dataset
        const fileNames: string[] = fs.readdirSync(this.FILEDIR);
        if (!fileNames.includes(id)) {
            throw new Error("Cannot delete file with id: " + id + " because it does not exist");
        }
        // Delete file
        fs.unlinkSync(this.FILEDIR + id);
    }

    public async getDatasets(): Promise<ActualDataset[]> {
        let fileNames: string[] = [];
        fileNames = fs.readdirSync(this.FILEDIR);
        let foundData: ActualDataset[] = [];
        // Terminate early if no datasets to get
        if (fileNames === undefined || fileNames.length === 0) {
            return foundData;
        }
        for (const file of fileNames) {
            foundData.push(JSON.parse((fs.readFileSync(this.FILEDIR + file)).toString()));
        }
        this.growUp();
        return foundData;
    }

    private growUp() {
        this.Status = DiskManagerStatus.Adult;
    }
}
