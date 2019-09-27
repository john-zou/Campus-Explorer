import { InsightError, NotFoundError } from "../controller/IInsightFacade";
import { RequestExpiredError } from "restify";

export default class Insight {
    public static Error(msg: string): Promise<any> {
        return Promise.reject(new InsightError(msg));
    }

    public static NotFound(msg: string): Promise<any> {
        return Promise.reject(new NotFoundError(msg));
    }
}
