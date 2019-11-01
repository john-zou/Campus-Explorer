import { Building } from "./Building";
const http = require("http");

export class GeoResponse {
    public lat?: number;
    public lon?: number;
    public error?: string;
}

// Generate a GeoResponse given an address
export async function geolocate(buildings: Building[]): Promise<Building[]> {
    // Send http request http://cs310.students.cs.ubc.ca:11316/api/v1/project_team<264>/<ADDRESS>
    const url: string = "http://cs310.students.cs.ubc.ca:11316/api/v1/project_team264/";
    let newBuildings: Building[] = [];
    for (const building of buildings) {
        const transformedAddress = transformAddress(building.address);
        let response: GeoResponse = await getlatlon(url + transformedAddress);
        building.loc = response;
        newBuildings.push(building);
    }
    return newBuildings;
}

export function getlatlon(address: string): Promise<GeoResponse> {
    // https://nodejs.org/docs/latest-v10.x/api/http.html#http_http_get_options_callback
    return new Promise(function (resolve, reject) {
        http.get(address, function (res: any) {
            const { statusCode } = res;
            const contentType = res.headers["content-type"];
            let error;
            if (statusCode !== 200) {
              error = new Error("Request Failed.\n" +
                                `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
              error = new Error("Invalid content-type.\n" +
                                `Expected application/json but received ${contentType}`);
            }
            if (error) {
              error = new Error(error.message);
              // consume response data to free up memory
              res.resume();
              throw error;
            }
            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", function (chunk: any) {
                rawData += chunk;
            });
            res.on("end", () => {
              try {
                const parsedData = JSON.parse(rawData);
                resolve(parsedData);
              } catch (e) {
                throw new Error(e.message);
              }
            });
          }).on("error", (e: any) => {
            throw new Error(`Got error: ${e.message}`);
          });
    });
}

export function transformAddress(address: string) {
    return address.replace(/\s/g, "%20");
}
