import { IDatasetManager } from "./IDatasetManager";
import { InsightDatasetKind, InsightDataset, InsightError, NotFoundError } from "../controller/IInsightFacade";
import { IParsedData } from "../data/IParsedData";
import { IDataParser } from "../data/IDataParser";
import { Factory } from "./Factory";

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
        // check if id has underscore or is only whitespace
        if (id.includes("_") || id.trim().length === 0) {
            throw new InsightError("ID must not contain _ and must not be fully whitespace");
        }
        // check if dataset is in our list
        if (this.datasetIds.includes(id)) {
            throw new InsightError("There is already a dataset with give ID in the list");
        }
        // call dataparser
        this.parsedDatasets.push(await this.dataParser.parseDatasetZip(id, content, kind));
    }

    public async removeDataset(id: string): Promise<string> {
        // check if id is null or undefined
        if (id  === null || id === undefined) {
            throw new InsightError("Null or undefined argument");
        }
        // check if valid id
        if (this.isInvalidId(id)) {
            throw new InsightError("Invalid ID");
        }
        // check if dataset in datasetIDs
        if (!this.datasetIds.includes(id)) {
            throw new NotFoundError("ID not in dataset");
        }
        // remove from parsedData
        this.parsedDatasets = this.parsedDatasets.filter((d: IParsedData) => d.id !== id);
        // return resolved
        return id;
    }

    // Might be slow because it returns more information than is requested
    public async listDatasetsOld(): Promise<InsightDataset[]> {
        return this.parsedDatasets;
    }

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

    public async getData(id: string): Promise<IParsedData> {
        return this.parsedDatasets.find((d: IParsedData) => d.id === id);
    }

    public async getAllData(): Promise<IParsedData[]> {
        return this.parsedDatasets;
    }

    private isInvalidId(id: string): boolean {
        return id.includes("_") || id.trim().length === 0;
    }
}
