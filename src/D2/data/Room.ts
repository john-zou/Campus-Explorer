import { IRoom } from "./IRoom";
import { Building } from "./Building";

export class Room implements IRoom {
    public fullname: string;
    public shortname: string;
    public number: string;
    public name: string;
    public address: string;
    public lat: number;
    public lon: number;
    public seats: number;
    public type: string;
    public furniture: string;
    public href: string;

    public constructor(building: Building) {
        this.fullname = building.fullname;
        this.shortname = building.shortname;
        this.address = building.address;
        this.lat = building.loc.lat;
        this.lon = building.loc.lon;
    }
}
