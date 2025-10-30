import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const categories = [
  { id: 1, name: "Art & Design", logo: "🎨" },
  { id: 2, name: "Development", logo: "💻" },
  { id: 3, name: "Communication", logo: "🌐" },
  { id: 4, name: "Videography", logo: "🎥" },
  { id: 5, name: "Photography", logo: "📸" },
  { id: 6, name: "Marketing", logo: "📈" },
  { id: 7, name: "Content Writing", logo: "✍️" },
  { id: 8, name: "Finance", logo: "💰" },
  { id: 9, name: "Science", logo: "🔬" },
  { id: 10, name: "Network", logo: "🌐" },
];

const Categories = () => {
  const axiosSecure = useAxiosSecure();

  const { data: counts = {}, isLoading } = useQuery({
    queryKey: ["categoriesCount"],
    queryFn: async () => {
      const res = await axiosSecure.get("/sessions/category-count");
      return res.data; // backend থেকে expected: { "Art & Design": 3, ... }
    },
  });

  if (isLoading) return <p className="text-center py-10">Loading categories...</p>;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-12 bg-base-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 text-center sm:text-left">
        <div className="space-y-1">
          <h2 className="jost text-3xl sm:text-4xl md:text-4xl font-bold text-primary">
            Top Categories
          </h2>
          <p className="text-base opacity-70">Explore our Popular Categories</p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="
              card 
              bg-secondary/5
              border 
              border-primary 
              shadow-lg
              hover:shadow-md 
              transition-all 
              duration-200 
              hover:-translate-y-1 
              cursor-pointer
            "
          >
            <div className="card-body items-center text-center p-4 sm:p-6">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 text-primary">
                {cat.logo}
              </div>
              <h3 className="font-semibold text-sm sm:text-base">{cat.name}</h3>
              <p className="text-xs sm:text-sm opacity-70">
                {counts[cat.name] || 0} Courses
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;

