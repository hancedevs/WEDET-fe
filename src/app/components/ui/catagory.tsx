import { useState } from "react";

const categories = ["All", "Hiking", "Nature", "Adventure"];

export default function CategorySelector() {
  const [selected, setSelected] = useState("All");

  return (
    <div className="w-full px-7 pt-1">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-3 ">
        <h2
          className="text-gray-500 text-base "
          style={{
            fontFamily: "'Century Gothic', sans-serif",
            fontWeight: 500,
          }}
        >
          Categories
        </h2>
        <button
          className="text-gray-400 text-sm"
          style={{
            fontFamily: "'Century Gothic', sans-serif",
            fontWeight: 300,
          }}
        >
          See all
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-3 flex-wrap mb-6 justify-center ">
        {categories.map((yes) => (
          <button
            key={yes}
            onClick={() => setSelected(yes)}
            className={`px-4 py-7 pt-1 pb-1 text-[10px] rounded-full  text-sm border transition 
              ${
                selected === yes
                  ? "text-green-600 font-bold border-green-500"
                  : "text-gray-600 border-gray-600"
              }`}
            style={{
              fontFamily: "'Century Gothic', sans-serif",
              fontWeight: selected === yes ? 600 : 400,
            }}
          >
            {yes}
          </button>
        ))}
      </div>
    </div>
  );
}
