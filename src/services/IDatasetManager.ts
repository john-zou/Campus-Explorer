import { InsightDataset, InsightDatasetKind } from "../controller/IInsightFacade";
import { IParsedData } from "../data/IParsedData";

// takes dataset functions from InsightFacade
export interface IDatasetManager {
    datasetIds: string[];

    // Command-query separation
    addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<void>;

    removeDataset(id: string): Promise<string>;

    listDatasets(): Promise<InsightDataset[]>;

    /**
     *  returns first instance of dataset with given id
     *  returns undefined if does not exist
     */
    // Unused
    // getData(id: string): Promise<IParsedData>;

    // Returns all Datasets as an IParsedData array
    getOwen(): Promise<IParsedData[]>;
}
