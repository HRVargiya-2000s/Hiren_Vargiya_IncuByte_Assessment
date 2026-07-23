const STORAGE_KEY = "vehicleImages";

function readImages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getVehicleImage(vehicle) {
  if (vehicle.imageUrl) return vehicle.imageUrl;
  if (vehicle.image_url) return vehicle.image_url;

  const images = readImages();
  return images[String(vehicle.id)] || "";
}

export function saveVehicleImage(vehicleId, imageUrl) {
  if (!vehicleId) return;

  const images = readImages();

  if (imageUrl) {
    images[String(vehicleId)] = imageUrl;
  } else {
    delete images[String(vehicleId)];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}
