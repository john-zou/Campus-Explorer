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
        await this.datasetManager.addDataset(id, content, kind);
        return this.datasetManager.datasetIds;
    }

    public removeDataset(id: string): Promise<string> {
        return this.datasetManager.removeDataset(id);
    }

    public performQuery(query: any): Promise <any[]> {
        // for each section in ordered array
        //   if (filter(section, queryfilter))
        //     build new object, add to results array
        return this.queryPerformer.performQuery(query,
            this.datasetManager.getAllData(), this.datasetManager.datasetIds);
    }

    public listDatasets(): Promise<InsightDataset[]> {
        return this.datasetManager.listDatasets();
    }

    // Some helper functions we will (probably) need

    //  Check to see if a query is valid
    private validateQuery(query: any): boolean {return true; }

    // Check to see if a section meets given criteria
    private filter(section: any, criteria: any): boolean {return true; }
}
