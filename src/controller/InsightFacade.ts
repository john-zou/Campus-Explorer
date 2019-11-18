import Log from "../Util";
import {IInsightFacade, InsightDataset, InsightDatasetKind, InsightError} from "./IInsightFacade";
import { DatasetManager } from "../services/DatasetManager";
import { realize } from "../D2/query/Realize";
import { queryPipeline } from "../query pipeline/QueryPipeline";

/**
 * DONE for d2
 */
export default class InsightFacade implements IInsightFacade {
    private datasetManager: DatasetManager;

    constructor() {
        this.datasetManager = new DatasetManager();
    }

    public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
        try {
            await this.datasetManager.addDataset(id, content, kind);
            return this.datasetManager.getIDs();
        } catch (err) {
            Log.trace(`FAILED TO ADD DATASET: ID: ${id}, ${err}`);
            throw err;
        }
    }

    public async removeDataset(id: string): Promise<string> {
        return await this.datasetManager.removeDataset(id);
    }

    public async performQuery(query: any): Promise <any[]> {
        try {
            return queryPipeline(query, this.datasetManager.allData);
        } catch (err) {
            Log.trace(`Invalid Query: ${err}`);
            throw err;
        }
    }

    public async listDatasets(): Promise<InsightDataset[]> {
        return await this.datasetManager.listDatasets();
    }
}
