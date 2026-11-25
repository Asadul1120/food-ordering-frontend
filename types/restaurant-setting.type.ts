export interface RestaurantHour {
  dayOfWeek: number;
  isClosed: boolean;
  opensAt: string | null;
  closesAt: string | null;
}

export interface RestaurantSetting {
  name: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  address: string | null;
  deliveryArea: string | null;
  googleMapsUrl: string | null;
  facebookUrl: string | null;
  timezone: string;
  hours: RestaurantHour[];
}