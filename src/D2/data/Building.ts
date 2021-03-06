import { GeoResponse, geolocate } from "./GeoResponse";

export class Building {
    public href: string;
    public loc: GeoResponse;
    public address: string;
    public fullname: string;
    public shortname: string;

    public constructor(href: string, address: string, fullname: string, shortname: string) {
        this.href = href;
        this.address = address;
        this.fullname = fullname;
        this.shortname = shortname;
    }
}
