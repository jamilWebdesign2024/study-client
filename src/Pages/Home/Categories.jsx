import React from "react";

const Categories = () => {
    const categories = [
        { id: 1, name: "Art & Design", logo: "🎨", courses: 38 },
        { id: 2, name: "Development", logo: "💻", courses: 38 },
        { id: 3, name: "Communication", logo: "🌐", courses: 38 },
        { id: 4, name: "Videography", logo: "🎥", courses: 38 },
        { id: 5, name: "Photography", logo: "📸", courses: 38 },
        { id: 6, name: "Marketing", logo: "📈", courses: 38 },
        { id: 7, name: "Content Writing", logo: "✍️", courses: 38 },
        { id: 8, name: "Finance", logo: "💰", courses: 38 },
        { id: 9, name: "Science", logo: "🔬", courses: 38 },
        { id: 10, name: "Network", logo: "🌐", courses: 38 },
    ];

    return (
        <section className="py-10 px-4 sm:px-6 lg:px-12 bg-base-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 text-center sm:text-left">
                <div className="space-y-1">
                    <h2 className="jost text-3xl sm:text-4xl md:text-4xl font-bold text-primary">Top Categories</h2>
                    <p className="text-base opacity-70">
                        Explore our Popular Categories
                    </p>
                </div>
                {/* <button className="btn btn-outline btn-sm w-fit mx-auto sm:mx-0">
                    All Categories
                </button> */}
            </div>

            {/* Categories Grid */}
            <div
                className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          gap-4 
          sm:gap-6 
          lg:gap-8
        "
            >
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
                            <h3 className="font-semibold text-sm sm:text-base">
                                {cat.name}
                            </h3>
                            <p className="text-xs sm:text-sm opacity-70">
                                {cat.courses} Courses
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Categories;

