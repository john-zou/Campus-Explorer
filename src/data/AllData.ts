import { InsightDataset, InsightDatasetKind } from "../controller/IInsightFacade";
import { IDCheckResult } from "./IDCheckResult";
import { Dataset } from "./Dataset";
import Log from "../Util";

/**
 * Physical data class
 *
 * Key features:
 * - Each Dataset can be directly parsed to and from a JSON string (and ultimately, file on SSD)
 * - Given an ID, can immeditely check whether it exists and what kind of dataset it is
 * - Directly supplies all the needs of InsightFacade other than performQuery
 * - A single Dataset can be served up by ID
 * - DataManager can add/remove/list
 * - DiskManager can create an AllData using fromDatasetArray
 *
 * The reality behind the facade
 */
export class AllData {
    public Datasets: Dataset[];
    public InsightDatasets: InsightDataset[];
    public IDs: string[];

    private constructor() {
        //
    }

    /**
     * @param datasets an array of datasets (Courses or Rooms flavor) from files
     */
    public static fromDatasetArray(datasets: Dataset[]) {
        const ir = new AllData();
        ir.Datasets = datasets;
        ir.InsightDatasets = [];
        ir.IDs = [];
        for (const d of datasets) {
            try {
                ir.InsightDatasets.push(Dataset.toInsightDataset(d));
            } catch (err) {
                Log.error(err);
            }

            ir.IDs.push(d.ID);
        }
        return ir;
    }

    public checkID(id: string): IDCheckResult {
        for (const d of this.InsightDatasets) {
            if (d.id === id) {
                switch (d.kind) {
                    case InsightDatasetKind.Courses: return IDCheckResult.Courses;
                    case InsightDatasetKind.Rooms: return IDCheckResult.Rooms;
                }
            }
        }
        return IDCheckResult.NotFound;
    }

    public getDataset(id: string): Dataset {
        return this.Datasets.find((d) => {
            return d.ID === id;
        });
    }

    public addDataset(dataset: Dataset) {
        this.Datasets.push(dataset);
        this.InsightDatasets.push(Dataset.toInsightDataset(dataset));
        this.IDs.push(dataset.ID);
    }

    public removeDataset(id: string) {
        this.Datasets = this.Datasets.filter((d) => {
            return d.ID !== id;
        });
        this.InsightDatasets = this.InsightDatasets.filter((d) => {
            return d.id !== id;
        });
        this.IDs = this.IDs.filter((ID) => {
            return ID !== id;
        });
    }

    /**
     * In case someone forgets the public field
     */
    public listDatasets() {
        return this.InsightDatasets;
    }

    /**
     * In case someone forgets the public field
     */
    public getAllIDs() {
        return this.IDs;
    }
}
