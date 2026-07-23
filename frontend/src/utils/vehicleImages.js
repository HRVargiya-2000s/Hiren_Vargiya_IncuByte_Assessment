const STORAGE_KEY = "vehicleImages";

const PRESET_IMAGES = {
  "maruti suzuki": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  "hyundai": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  "tata": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
  "mahindra": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
  "honda": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
  "toyota": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80",
  "kia": "https://images.unsplash.com/photo-1617469767053-d3b508a0d84d?auto=format&fit=crop&w=800&q=80",
  "mg": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
};

const FALLBACK_LIST = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
];

function readImages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getVehicleImage(vehicle) {
  if (!vehicle) return FALLBACK_LIST[0];
  if (vehicle.imageUrl) return vehicle.imageUrl;
  if (vehicle.image_url) return vehicle.image_url;

  const images = readImages();
  const stored = images[String(vehicle.id)];
  if (stored) return stored;

  const make = String(vehicle.make || "").toLowerCase().trim();
  if (PRESET_IMAGES[make]) return PRESET_IMAGES[make];

  const idNum = Number(vehicle.id) || 0;
  return FALLBACK_LIST[idNum % FALLBACK_LIST.length];
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
