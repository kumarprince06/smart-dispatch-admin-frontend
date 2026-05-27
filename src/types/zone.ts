export interface ServiceZone {
  id: number;
  name: string;
  city: string;
  centerLatitude: number;
  centerLongitude: number;
  radiusKm: number;
  active: boolean;
  zoneMultiplier: number;
}
