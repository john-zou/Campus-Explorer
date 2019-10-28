import { InsightDatasetKind, InsightDataset, InsightError, NotFoundError } from "../controller/IInsightFacade";
import { DiskManager } from "./DiskManager";
import { AllData } from "../data/AllData";
import { IDCheckResult } from "../data/IDCheckResult";
import { Dataset } from "../data/Dataset";
import { DataParser } from "../data/DataParser";
import { DiskManagerStatus } from "./IDiskManager";
import { ULTRAINSTINCT } from "../D2/query/Ultra Instinct/UltraInstinct";
import Log from "../Util";

export class DatasetManager {
    private dataParser: DataParser;
    public allData: AllData;
    private diskManager: DiskManager;

    public constructor(dataparser = new DataParser(), diskManager = new DiskManager()) {
        this.diskManager = diskManager;
        this.dataParser = dataparser;
    }

    public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<void> {
        await this.getDataFromDiskIfNeeded();
        if (id == null || content == null || kind == null) {
            throw new InsightError("Null argument(s)");
        }
        if (this.isInvalidId(id)) {
            throw new InsightError("ID must not contain _ and must not be fully whitespace");
        }
        if (this.allData.checkID(id) !== IDCheckResult.NotFound) {
            throw new InsightError("There is already a dataset with given ID in the list");
        }
        let newData: Dataset = await this.dataParser.parseDatasetZip(id, content, kind);
        this.allData.addDataset(newData);
        this.diskManager.saveDatasetSync(newData);
    }

    public async removeDataset(id: string): Promise<string> {
        await this.getDataFromDiskIfNeeded();
        if (id == null) {
            throw new InsightError("Null argument");
        }
        if (this.isInvalidId(id)) {
            throw new InsightError("Invalid ID");
        }
        if (this.allData.checkID(id) === IDCheckResult.NotFound) {
            throw new NotFoundError("ID not in dataset");
        }
        // remove from parsedData
        this.allData.removeDataset(id);
        // remove from disk, encapsulate in the correct type of promise
        this.diskManager.deleteDatasetSync(id);
        return id;
    }

    public async listDatasets(): Promise<InsightDataset[]> {
        await this.getDataFromDiskIfNeeded();
        return this.allData.InsightDatasets;
    }

    private isInvalidId(id: string): boolean {
        return id.includes("_") || id.trim().length === 0;
    }

    private async getDataFromDiskIfNeeded(): Promise<void> {
        await this.diskManager.initializeIfNeeded();
        if (this.diskManager.Status === DiskManagerStatus.NewlyBorn) {
            Log.trace("DiskManager: I am grown up now!");
            this.allData = AllData.fromDatasetArray(await this.diskManager.getDatasets());
        }
    }

    public getIDs() {
        return this.allData.IDs;
    }
}
