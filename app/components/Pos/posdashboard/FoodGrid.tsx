import FoodCard from './FoodCard'


export const foods = [
  {
    id: 1,
    name: "Steak sapi bakar",
    price: 25.12,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ2R4RC6EEPKYvKcEJPa4N1Qq39XFHkXILHA&s",
  },
  {
    id: 2,
    name: "Ayam kentang",
    price: 15.4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqDxD6noPVm9TA2VV_jWve0joapdkuvDDY5wRFkG9GCxIeSnmF_1Vx-zk&s",
  },
  {
    id: 3,
    name: "Ikan santan",
    price: 11.21,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3WcgGWLYXzyCf-gzIQI-Hf7ndsdgrcm_TtQ&s",
  },
  {
    id: 4,
    name: "Mie Kuah Pedas",
    price: 10.4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2XnzeXJcJ5tRbNVquaa889uHQzXz-kBh5ag&s",
  },
  {
    id: 5,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 6,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 7,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 8,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 9,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 10,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 11,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 12,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 13,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 14,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 15,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 16,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 17,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
  {
    id: 18,
    name: "Kuah santan",
    price: 5.50,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRALAGFcVj2zAWMAViVc4z4RQAFQFvO5sKSKw&s",
  },
];
type Props = {
  search: string;
};

export default function FoodGrid({ search }: Props) {
  const filteredFoods = foods.filter((food) => {
    const query = search.toLowerCase().trim();

    return (
      food.name.toLowerCase().includes(query) ||
      food.id.toString().includes(query)
    );
  });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredFoods.map((food) => (
          <FoodCard key={food.id} item={food} />
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          No food items found
        </p>
      )}
    </>
  );
}
