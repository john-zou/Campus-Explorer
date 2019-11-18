import { AllData } from "../data/AllData";
import { IDHolder } from "./IDHolder";
import { invalid } from "./QueryPipeline";
import { validateKey } from "./ValidateKey";
import { validateOptions } from "./ValidateOptions";
import { endOfPipeline } from "./EndOfPipeline";
import { ResultTooLargeError } from "../controller/IInsightFacade";

export const basicPipeline = (query: any,
                              allData: AllData,
                              filteringHappened: boolean = false,
                              filteredElements: any[] = null,
                              idHolder: IDHolder = new IDHolder()): any[] => {
    // Validation
    validateOptions(query, allData, idHolder);
    if (filteringHappened) {
        if (filteredElements.length > 5000) {
            throw new ResultTooLargeError();
        }
        return endOfPipeline(query, filteredElements);
    } else {
        const dataset = allData.getDataset(idHolder.get());
        if (dataset.Elements.length > 5000) {
            throw new ResultTooLargeError();
        }
        return endOfPipeline(query, dataset.Elements);
    }
};
