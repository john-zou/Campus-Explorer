export class GeoResponse {
    public lat?: number;
    public lon?: number;
    public error?: string;
}

// Generate a GeoResponse given an address
export function geolocate(address: string): GeoResponse {
    return null; // stub
}
