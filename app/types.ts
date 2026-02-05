import { InferSelectModel } from "drizzle-orm";
import { reelMetadata } from "./db/schema";


export type ReelMetadataRow =  InferSelectModel<typeof reelMetadata>;

export interface Places{
  placeId: string,
  displayName:string,
  formattedAddress: string,
  lat: number,
  lng: number,
  type: string
}

export interface ReelJobData{
  userId: string,
  url: string
}

export type ReelShortCodeSearch= {
  valid: boolean,
  isNew: boolean,
  shortCode: string | null,
  existing: ReelMetadataRow | null
}

export interface MapPlaceDetails {
  placeId: string;
  displayName: string;
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  website?: string;
  phone?: string;
  openingHours?: string[];
  photos?: string[];
}