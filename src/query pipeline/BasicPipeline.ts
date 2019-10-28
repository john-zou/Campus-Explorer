import { AllData } from "../data/AllData";
import { IDHolder } from "./IDHolder";
import { invalid } from "./QueryPipeline";
import { validateKey } from "./ValidateKey";
import { validateOptions } from "./ValidateOptions";
import { endOfPipeline } from "./EndOfPipeline";

export const basicPipeline = (query: any,
                              allData: AllData,
                              filteringHappened: boolean = false,
                              filteredElements: any[] = null,
                              idHolder: IDHolder = new IDHolder()): any[] => {
    // Validation
    validateOptions(query, allData, idHolder);
    if (filteringHappened) {
        return endOfPipeline(query, filteredElements);
    } else {
        const dataset = allData.getDataset(idHolder.get());
        return endOfPipeline(query, dataset.Elements);
    }
};
