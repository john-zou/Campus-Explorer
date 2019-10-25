import { IRoom } from "./IRoom";

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

    private constructor() {
        // Doesn't do anything
    }

    // Should get the room from the href
    public getRoomFromFile(href: any) {
        // stub
    }
}
