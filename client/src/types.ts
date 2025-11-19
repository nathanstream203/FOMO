export interface Bar {
  id: string;
  name: string;
  address: string;
  rating?: number;
  openTime?: string;
  closeTime?: string;
  checkedInCount?: number;
}

export interface MapSectionProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markers: Array<{
    id: string | number;
    latitude: number | string;
    longitude: number | string;
    name?: string;
  }>;
  activeMarker: any;
  setActiveMarker: (marker: any) => void;
  isCheckedIn: boolean;
  setIsCheckedIn: (checkedIn: boolean) => void;
  circleRadius?: number;
  mapStyle?: any;
  setActiveTab?: (tab: "details" | "live") => void; // add this
}

export interface BarLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  events?: Event[]; // optional if you track events per bar
}
