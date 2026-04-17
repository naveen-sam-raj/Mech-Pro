import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";
import products from "./db";

const CARD_BG = "bg-[#cfe9df]";

const CategoryProducts = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const categories = [
    { key: "bike", title: "Bike Parts" },
    { key: "car", title: "Car Parts" },
    { key: "engine", title: "Engine Tools" },
    { key: "accessories", title: "Accessories" },
  ];
  return (
    <div className="bg-[#f2f7f5] min-h-screen px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center mb-10">
        <button
          onClick={() => navigate("/")}
          className="bg-emerald-700 text-white px-6 py-2 rounded-lg"
        >
          Back
        </button>
        <h1 className="flex-1 text-center text-3xl font-bold">All Products</h1>
      </div>

      {categories.map((cat) => {
        const filtered = products.filter((p) => p.category === cat.key);

        return (
          <div key={cat.key} className="mb-16">
            <h2 className="text-2xl font-bold mb-6">{cat.title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <div key={p.id} className={`${CARD_BG} rounded-xl shadow`}>
                  <div className="h-44 bg-white flex items-center justify-center rounded-t-xl">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full object-contain"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold truncate">{p.name}</h3>
                    <p className="text-emerald-700 font-bold">₹{p.price}</p>

                    <button
                      onClick={() => addToCart(p)}
                      className="mt-4 w-full bg-emerald-700 text-white py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryProducts;
