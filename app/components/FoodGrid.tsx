import { foods } from "../dummydata/data";
import FoodCard from "./FoodCard";

export default function FoodGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {foods.map((food) => (
        <FoodCard key={food.id} item={food} />
      ))}
    </div>
  );
}
