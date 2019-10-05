import { IDatasetManager } from "./IDatasetManager";
import { InsightDatasetKind, InsightDataset, InsightError, NotFoundError } from "../controller/IInsightFacade";
import { IParsedData } from "../data/IParsedData";
import { IDataParser } from "../data/IDataParser";
import { Factory } from "./Factory";
import { IDiskManager } from "./IDiskManager";

export class DatasetManager implements IDatasetManager {
    private dataParser: IDataParser;
    private parsedDatasets: IParsedData[] = [];
    private diskManager: IDiskManager;

    public get datasetIds(): string[] {
        return this.parsedDatasets.map((d: IParsedData) => d.id);
    }

    public constructor (dataparser: IDataParser = Factory.getDataParser(), diskManager = Factory.getDiskManager() ) {
        this.diskManager = diskManager;
        this.dataParser = dataparser;
        this.syncDatasets();
    }

    public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<void> {
        if (id == null || content == null || kind == null) {
            throw new InsightError("Null argument(s)");
        }
        if (typeof id !== "string" || typeof content !== "string" || (kind !== InsightDatasetKind.Courses
            && kind !== InsightDatasetKind.Rooms)) {
                // This is not triggerable in Typescript
                throw new InsightError("Invalid argument type");
            }
        if (this.isInvalidId(id)) {
            throw new InsightError("ID must not contain _ and must not be fully whitespace");
        }
        if (this.datasetIds.includes(id)) {
            throw new InsightError("There is already a dataset with given ID in the list");
        }
        let newData: IParsedData = await this.dataParser.parseDatasetZip(id, content, kind);
        this.parsedDatasets.push(newData);
        this.diskManager.saveDataset(newData);
    }

    public async removeDataset(id: string): Promise<string> {
        if (id == null) {
            throw new InsightError("Null argument");
        }
        if (this.isInvalidId(id)) {
            throw new InsightError("Invalid ID");
        }
        if (!this.datasetIds.includes(id)) {
            throw new NotFoundError("ID not in dataset");
        }
        // remove from parsedData
        this.parsedDatasets = this.parsedDatasets.filter((d: IParsedData) => d.id !== id);
        // remove from disk, encapsulate in the correct type of promise
        return new Promise ((resolve, reject) => {
            this.diskManager.deleteDataset(id).then ((p: void[]) => {
                return resolve(id);
            }).catch ((err: any) => {
                throw reject(err);
            });
        });
    }

    // Causes timeout for autobot d1
    // public async listDatasetsOld(): Promise<InsightDataset[]> {
    //     return this.parsedDatasets;
    // }

    public async listDatasets(): Promise<InsightDataset[]> {
        let ret: InsightDataset[] = [];
        for (const dataset of this.parsedDatasets) {
            const strictlyInsightDataset: InsightDataset = {
                id: dataset.id, kind: dataset.kind, numRows: dataset.numRows
            };
            ret.push(strictlyInsightDataset);
        }
        return ret;
    }

    // Unused
    // public async getData(id: string): Promise<IParsedData> {
    //     return this.parsedDatasets.find((d: IParsedData) => d.id === id);
    // }

    public async getAllData(): Promise<IParsedData[]> {
        return this.parsedDatasets;
    }

    private isInvalidId(id: string): boolean {
        return id.includes("_") || id.trim().length === 0;
    }

    // Syncs datasets on the disk and locally
    public async syncDatasets() {
        const diskDataset: IParsedData[] = await this.diskManager.getDatasets();
        if (this.parsedDatasets.length < diskDataset.length) {
            this.parsedDatasets = diskDataset;
        }
    }
}
