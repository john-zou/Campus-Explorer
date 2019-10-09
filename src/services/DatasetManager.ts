import { InsightDatasetKind, InsightDataset, InsightError, NotFoundError } from "../controller/IInsightFacade";
import { DiskManager } from "./DiskManager";
import { OwensReality } from "../data/OwensReality";
import { JohnsRealityCheck } from "../data/JohnsRealityCheck";
import { ActualDataset } from "../data/ActualDataset";
import { DataParser } from "../data/DataParser";
import { DiskManagerStatus } from "./IDiskManager";

export class DatasetManager {
    private dataParser: DataParser;
    public Owen: OwensReality;
    private diskManager: DiskManager;

    public constructor (dataparser = new DataParser(), diskManager = new DiskManager()) {
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
        if (this.Owen.checkID(id) !== JohnsRealityCheck.NotFound) {
            throw new InsightError("There is already a dataset with given ID in the list");
        }
        let newData: ActualDataset = await this.dataParser.parseDatasetZip(id, content, kind);
        this.Owen.addDataset(newData);
        await this.diskManager.saveDataset(newData);
    }

    public async removeDataset(id: string): Promise<string> {
        await this.getDataFromDiskIfNeeded();
        if (id == null) {
            throw new InsightError("Null argument");
        }
        if (this.isInvalidId(id)) {
            throw new InsightError("Invalid ID");
        }
        if (this.Owen.checkID(id) === JohnsRealityCheck.NotFound) {
            throw new NotFoundError("ID not in dataset");
        }
        // remove from parsedData
        this.Owen.removeDataset(id);
        // remove from disk, encapsulate in the correct type of promise
        await this.diskManager.deleteDataset(id);
        return id;
    }

    public async listDatasets(): Promise<InsightDataset[]> {
        await this.getDataFromDiskIfNeeded();
        return this.Owen.InsightDatasets;
    }

    private isInvalidId(id: string): boolean {
        return id.includes("_") || id.trim().length === 0;
    }

    private async getDataFromDiskIfNeeded(): Promise<void> {
        await this.diskManager.initializeIfNeeded();
        if  (this.diskManager.Status === DiskManagerStatus.NewlyBorn) {
            this.Owen = OwensReality.fromDatasetArray(await this.diskManager.getDatasets());
        }
    }

    public getIDs() {
        return this.Owen.IDs;
    }
}
