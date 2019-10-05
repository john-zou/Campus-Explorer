import { QueryPerformer } from "./QueryPerformer";
import { DatasetManager } from "./DatasetManager";
import { DataParser } from "../data/DataParser";
import { QueryValidator } from "./QueryValidator";
import { QP2 } from "./QP2";
import { IQueryPerformer } from "./IQueryPerformer";
import { DiskManager } from "./DiskManager";

export class Factory {
    public static getDiskManager() {
        return new DiskManager();
    }
    // private static dm: DatasetManager;
    public static getQueryValidator(): import ("./IQueryValidator").IQueryValidator {
        return new QueryValidator();
    }
    public static getDataParser(): import ("../data/IDataParser").IDataParser {
        return new DataParser();
    }
    public static getDatasetManager(): import ("./IDatasetManager").IDatasetManager {
        // if (Factory.dm == null) {
        //     Factory.dm = new DatasetManager();
        // }
        // return Factory.dm;
        return new DatasetManager();
    }

    public static getQueryPerformer(): import ("./IQueryPerformer").IQueryPerformer {
        return new QP2(); // Set implementation here
    }
}
