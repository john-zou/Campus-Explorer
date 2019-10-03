import Log from "../Util";
import {IInsightFacade, InsightDataset, InsightDatasetKind} from "./IInsightFacade";
import {InsightError, NotFoundError} from "./IInsightFacade";
import * as JSZip from "jszip";
import { IDatasetManager } from "../services/IDatasetManager";
import { IQueryPerformer } from "../services/IQueryPerformer";
import { Factory } from "../services/Factory";

/**
 * This is the main programmatic entry point for the project.
 * Method documentation is in IInsightFacade
 *
 */
export default class InsightFacade implements IInsightFacade {
    private datasetManager: IDatasetManager;
    private queryPerformer: IQueryPerformer;

    constructor() {
        // Log.trace("InsightFacadeImpl::init()");
        this.datasetManager = Factory.getDatasetManager();
        this.queryPerformer = Factory.getQueryPerformer();
        // Log.trace("InsightFacade constructor: dependencies injected.");
    }

    public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string[]> {
        try {
            await this.datasetManager.addDataset(id, content, kind);
            return this.datasetManager.datasetIds;
        } catch (err) {
            Log.trace(`Failed to add dataset because of :${err}`);
            throw err;
        }
    }

    public async removeDataset(id: string): Promise<string> {
        return await this.datasetManager.removeDataset(id);
    }

    public async performQuery(query: any): Promise <any[]> {
        try {
            return await this.queryPerformer.performQuery(query,
                await this.datasetManager.getAllData(), this.datasetManager.datasetIds);
        } catch (err) {
            Log.trace(`Query deemed invalid: ${err}`);
            throw err;
        }
    }

    public async listDatasets(): Promise<InsightDataset[]> {
        return await this.datasetManager.listDatasets();
    }
}
