import RestaurantSettingsForm from "@/components/admin/restaurant-settings-form";

export const instant = false;

export default function RestaurantSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#052b24]">Restaurant settings</h1>
      <RestaurantSettingsForm />
    </div>
  );
}