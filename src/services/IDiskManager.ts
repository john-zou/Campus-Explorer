import { IParsedData } from "../data/IParsedData";
import { ActualDataset } from "../data/ActualDataset";
import { OwensReality } from "../data/OwensReality";

// Manages datasets on disk
export interface IDiskManager {
    Status: DiskManagerStatus;

    initializeIfNeeded(): Promise<void>;

    saveDataset(dataset: ActualDataset): Promise<void>;

    deleteDataset(id: string): Promise<void>;

    // Return all data saved on disk
    getDatasets(): Promise<ActualDataset[]>;
}

export enum DiskManagerStatus {
    NewlyBorn = "Newly Born",
    Adult = "Adult"
}
