import { QueryPerformer } from "./QueryPerformer";
import { DatasetManager } from "./DatasetManager";
import { DataParser } from "../data/DataParser";

export class Factory {
    public static getDataParser(): import ("../data/IDataParser").IDataParser {
        return new DataParser();
    }
    public static getDatasetManager(): import ("./IDatasetManager").IDatasetManager {
        return new DatasetManager();
    }
    public static getQueryPerformer(): import ("./IQueryPerformer").IQueryPerformer {
        return new QueryPerformer();
    }
}
