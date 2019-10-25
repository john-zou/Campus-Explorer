import { GeoResponse } from "../../data/GeoResponse";
import Log from "../../../Util";

const http = require("http");

const DDOS_TARGET = "http://cs310.students.cs.ubc.ca:11316/api/v1/project_team264/";

export const getLatLonFromAddress = (address: string): Promise<GeoResponse> =>  {
    const formattedAddress = formatAddress(address);
    return new Promise<GeoResponse> ((resolve, reject) => {
        // https://nodejs.org/docs/latest-v10.x/api/http.html#http_http_get_options_callback
        http.get(DDOS_TARGET + formattedAddress, (res: any) => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];

        let error;
        if (statusCode !== 200 && statusCode !== 404) {
            error = new Error("Request Failed.\n" +
                      `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error("Invalid content-type.\n" +
                      "Expected application/json but received ${contentType}");
        }
        if (error) {
            Log.error(error.message);
            // consume response data to free up memory
            res.resume();
            reject(error);
            return;
        }

        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", (chunk: any) => {
            rawData += chunk;
        });
        res.on("end", () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData as GeoResponse);
                    return;
                } catch (e) {
                    Log.error(e.message);
                    reject(e);
                    return;
                }
            });
        }).on("error", (e: any) => {
            Log.error(`Got error: ${e.message}`);
            reject(e);
            return;
        });
    });
};

export const formatAddress = (address: string): string => {
    return address.replace(" ",  "%20");
};
