import pool from "../config/db.js";

const vehicles = [
  {
    make: "Maruti Suzuki",
    model: "Swift",
    category: "Hatchback",
    price: 725000,
    quantity: 6,
  },
  {
    make: "Hyundai",
    model: "Creta",
    category: "SUV",
    price: 1450000,
    quantity: 4,
  },
  {
    make: "Tata",
    model: "Nexon",
    category: "Compact SUV",
    price: 1180000,
    quantity: 3,
  },
  {
    make: "Mahindra",
    model: "Scorpio N",
    category: "SUV",
    price: 1890000,
    quantity: 2,
  },
  {
    make: "Honda",
    model: "City",
    category: "Sedan",
    price: 1325000,
    quantity: 5,
  },
  {
    make: "Toyota",
    model: "Innova Crysta",
    category: "MPV",
    price: 2450000,
    quantity: 1,
  },
  {
    make: "Kia",
    model: "Seltos",
    category: "SUV",
    price: 1630000,
    quantity: 3,
  },
  {
    make: "MG",
    model: "Hector",
    category: "SUV",
    price: 2140000,
    quantity: 0,
  },
];

for (const vehicle of vehicles) {
  await pool.query(
    `
    INSERT INTO vehicles
      (make, model, category, price, quantity)
    SELECT $1::varchar, $2::varchar, $3::varchar, $4::numeric, $5::integer
    WHERE NOT EXISTS (
      SELECT 1
      FROM vehicles
      WHERE LOWER(make) = LOWER($1::varchar)
        AND LOWER(model) = LOWER($2::varchar)
    )
    `,
    [
      vehicle.make,
      vehicle.model,
      vehicle.category,
      vehicle.price,
      vehicle.quantity,
    ]
  );
}

console.log(`Seeded ${vehicles.length} sample vehicles`);

await pool.end();
