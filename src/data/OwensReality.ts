import { InsightDataset, InsightDatasetKind } from "../controller/IInsightFacade";
import { JohnsRealityCheck } from "./JohnsRealityCheck";
import { ActualDataset } from "./ActualDataset";
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
 * - DiskManager can create an OwensReality using fromDatasetArray
 *
 * The reality behind the facade
 */
export class OwensReality {
    public ActualDatasets: ActualDataset[];
    public InsightDatasets: InsightDataset[];
    public IDs: string[];

    private constructor() {
        //
    }

    /**
     * @param datasets an array of datasets (Courses or Rooms flavor) from files
     */
    public static fromDatasetArray(datasets: ActualDataset[]) {
        const ir = new OwensReality();
        ir.ActualDatasets = datasets;
        ir.InsightDatasets = [];
        ir.IDs = [];
        for (const d of datasets) {
            try {
                ir.InsightDatasets.push(d.toInsightDataset());
            } catch (err) {
                Log.error(err);
            }

            ir.IDs.push(d.ID);
        }
        return ir;
    }

    public checkID(id: string): JohnsRealityCheck {
        for (const d of this.InsightDatasets) {
            if (d.id === id) {
                switch (d.kind) {
                    case InsightDatasetKind.Courses: return JohnsRealityCheck.Courses;
                    case InsightDatasetKind.Rooms: return JohnsRealityCheck.Rooms;
                }
            }
        }
        return JohnsRealityCheck.NotFound;
    }

    public getDataset(id: string): ActualDataset {
        return this.ActualDatasets.find((d) => {
            return d.ID === id;
        });
    }

    public addDataset(dataset: ActualDataset) {
        this.ActualDatasets.push(dataset);
        this.InsightDatasets.push(dataset.toInsightDataset());
        this.IDs.push(dataset.ID);
    }

    public removeDataset(id: string) {
        this.ActualDatasets = this.ActualDatasets.filter((d) => {
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
