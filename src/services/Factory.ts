import { QueryPerformer } from "./QueryPerformer";
import { DatasetManager } from "./DatasetManager";
import { DataParser } from "../data/DataParser";
import { QueryValidator } from "./QueryValidator";
import { QP2 } from "./QP2";

export class Factory {
    public static getQueryValidator(): import ("./IQueryValidator").IQueryValidator {
        return new QueryValidator();
    }
    public static getDataParser(): import ("../data/IDataParser").IDataParser {
        return new DataParser();
    }
    public static getDatasetManager(): import ("./IDatasetManager").IDatasetManager {
        return new DatasetManager();
    }
    public static getQueryPerformer(): import ("./IQueryPerformer").IQueryPerformer {
        return new QP2();
    }
}
