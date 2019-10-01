import { IDatasetManager } from "./IDatasetManager";
import { InsightDatasetKind, InsightDataset, InsightError } from "../controller/IInsightFacade";
import { IParsedData } from "../data/IParsedData";
import { IDataParser } from "../data/IDataParser";
import { Factory } from "./Factory";
import Log from "../Util";
import Insight from "../util/Insight";
import { remove } from "fs-extra";

export class DatasetManager implements IDatasetManager {
    private dataParser: IDataParser;
    private parsedDatasets: IParsedData[] = [];
    public get datasetIds(): string[] {
        return this.parsedDatasets.map((d: IParsedData) => d.id);
    }

    public constructor (dataparser: IDataParser = Factory.getDataParser()) {
        this.dataParser = dataparser;
    }

    public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<void> {
        // check if id or content is null/undefined
        if (id === null || content === null || id === undefined || content === undefined) {
            throw new InsightError("Null argument(s)");
        }
        // check if dataset is in our list
        if (this.datasetIds.includes(id)) {
            throw new InsightError("There is already a dataset with give ID in the list");
        }
        // call dataparser
        try {
            this.parsedDatasets.push(await this.dataParser.parseDatasetZip(id, content, kind));
        } catch (err) {
            throw err;
        }
    }

    public async removeDataset(id: string): Promise<string> {
        // check if id is null or undefined
        if (id  === null || id === undefined) {
            return Insight.Error("Null or undefined argument");
        }
        // check if valid id
        if (this.isInvalidId(id)) {
            return Insight.Error("Invalid Error");
        }
        // check if dataset in datasetIDs
        if (!this.datasetIds.includes(id)) {
            return Insight.NotFound("ID not in dataset");
        }
        // remove from parsedData
        this.parsedDatasets = this.parsedDatasets.filter((d: IParsedData) => d.id !== id);
        // return resolved
        return id;
    }

    public async listDatasets(): Promise<InsightDataset[]> {
        return this.parsedDatasets;
    }

    public getData(id: string): IParsedData {
        return this.parsedDatasets.find((d: IParsedData) => d.id === id);
    }

    public getAllData(): IParsedData[] {
        return this.parsedDatasets;
    }

    private isInvalidId(id: string): boolean {
        return id.includes("_") || id.trim().length === 0;
    }
}
