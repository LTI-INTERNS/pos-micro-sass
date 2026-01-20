import { foods } from "../dummydata/data";
import FoodCard from "./FoodCard";

export default function FoodGrid() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {foods.map((food) => (
        <FoodCard key={food.id} item={food} />
      ))}
    </div>
  );
}
