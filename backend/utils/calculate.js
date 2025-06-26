const EFFICIENCY_PER_100KM = 10; //litres per 100 km

const calculateEffectiveFuelVolume = ({ price_per_litre, distance_km, budget }) => {
  const litresUsed = (distance_km * EFFICIENCY_PER_100KM) / 100;
  const travelCost = litresUsed * price_per_litre;

  const effectiveBudget = budget - travelCost;
  const fuelVolume = effectiveBudget > 0 ? effectiveBudget / price_per_litre : 0;

  return {
    travel_cost: travelCost.toFixed(2),
    effective_budget: effectiveBudget.toFixed(2),
    fuel_volume: fuelVolume.toFixed(2),
  };
};

module.exports = { calculateEffectiveFuelVolume };
