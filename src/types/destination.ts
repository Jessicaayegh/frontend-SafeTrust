export interface GeoPoint {
  lat: number;
  lng: number;
}

/** A province tile; its location is the value used by the rental URL filter. */
export interface Destination {
  id: string;
  location: import("./hotel").ApartmentListing["location"];
  name: string;
  tagline: string;
  imageUrl: string;
  coordinates: GeoPoint;
  category?: import("./hotel").ApartmentListing["category"];
}
