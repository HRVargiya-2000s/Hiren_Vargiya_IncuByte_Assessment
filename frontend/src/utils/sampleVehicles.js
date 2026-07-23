export const sampleVehicles = [
  {
    id: "sample-1",
    make: "Maruti Suzuki",
    model: "Swift",
    category: "Hatchback",
    year: 2024,
    price: 725000,
    quantity: 6,
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sample-2",
    make: "Hyundai",
    model: "Creta",
    category: "SUV",
    year: 2024,
    price: 1450000,
    quantity: 4,
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sample-3",
    make: "Tata",
    model: "Nexon",
    category: "Compact SUV",
    year: 2023,
    price: 1180000,
    quantity: 3,
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sample-4",
    make: "Mahindra",
    model: "Scorpio N",
    category: "SUV",
    year: 2024,
    price: 1890000,
    quantity: 2,
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sample-5",
    make: "Honda",
    model: "City",
    category: "Sedan",
    year: 2023,
    price: 1325000,
    quantity: 5,
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sample-6",
    make: "Toyota",
    model: "Innova Crysta",
    category: "MPV",
    year: 2024,
    price: 2450000,
    quantity: 1,
    imageUrl: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80",
  },
];

export function filterSampleVehicles(query) {
  const search = query.trim().toLowerCase();

  if (!search) return sampleVehicles;

  return sampleVehicles.filter((vehicle) =>
    [vehicle.make, vehicle.model, vehicle.category]
      .join(" ")
      .toLowerCase()
      .includes(search)
  );
}
