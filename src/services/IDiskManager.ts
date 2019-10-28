import { IParsedData } from "../data/IParsedData";
import { Dataset } from "../data/Dataset";
import { AllData } from "../data/AllData";

// Manages datasets on disk
export interface IDiskManager {
    Status: DiskManagerStatus;

    initializeIfNeeded(): Promise<void>;

    saveDatasetSync(dataset: Dataset): void;

    deleteDatasetSync(id: string): void;

    // Return all data saved on disk
    getDatasets(): Promise<Dataset[]>;
}

export enum DiskManagerStatus {
    NewlyBorn = "Newly Born",
    Adult = "Adult"
}
