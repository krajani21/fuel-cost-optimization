// A simple cost model without needing vehicle efficiency or refuel litres

const FLAT_COST_PER_KM = 0.10; // flat $0.10/km travel cost

const calculateTotalCost = ({
  price_per_litre,
  distance_km,
}) => {
  // Approximate cost to travel to the station
  const travel_cost = distance_km * FLAT_COST_PER_KM;

  // Total estimated cost = fuel price + travel cost
  const total_cost = price_per_litre + travel_cost;

  return {
    fuel_price: price_per_litre.toFixed(2),
    travel_cost: travel_cost.toFixed(2),
    total_cost: total_cost.toFixed(2),
  };
};

module.exports = { calculateTotalCost };
