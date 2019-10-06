import { IParsedData } from "../data/IParsedData";

// Manages datasets on disk
export interface IDiskManager {
    saveDataset(dataset: IParsedData): Promise<void>;

    deleteDataset(id: string): Promise<void>;

    // Return all data saved on disk
    // Returns with an empty IParsedData[] when nothing
    // is stored on disk
    getDatasets(): Promise<IParsedData[]>;
}
