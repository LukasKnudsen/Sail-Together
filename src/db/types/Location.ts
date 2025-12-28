import Parse from "parse";

export interface LocationAttributes {
  id: string;
  objectId: string;
  createdAt: Date;
  updatedAt: Date;
  address: string;
  latitude: number;
  longitude: number;
  name: string;
}

export class Location extends Parse.Object<LocationAttributes> {
  static className: string = "Location";

  constructor(data?: Partial<LocationAttributes>) {
    super("Location", data as LocationAttributes);
  }

  get address(): string {
    return super.get("address");
  }
  set address(value: string) {
    super.set("address", value);
  }

  get latitude(): number {
    return super.get("latitude");
  }
  set latitude(value: number) {
    super.set("latitude", value);
  }

  get longitude(): number {
    return super.get("longitude");
  }
  set longitude(value: number) {
    super.set("longitude", value);
  }

  get name(): string {
    return super.get("name");
  }
  set name(value: string) {
    super.set("name", value);
  }
}

Parse.Object.registerSubclass("Location", Location);

