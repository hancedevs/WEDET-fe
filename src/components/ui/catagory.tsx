import { useState } from "react";

const categories = ["All", "Hiking", "Nature", "Adventure"];

export default function CategorySelector() {
    const [selected, setSelected] = useState("All");

    return (
        <div className="w-full px-4 pt-1">
            <div className="flex items-center justify-between mb-3">
                <h2
                    className="text-gray-400 text-xs"
                    style={{
                        fontFamily: "'Century Gothic', sans-serif",
                        fontWeight: 300,
                    }}
                >
                    Categories
                </h2>
                <button
                    className="text-gray-400 text-xs"
                    style={{
                        fontFamily: "'Century Gothic', sans-serif",
                        fontWeight: 300,
                    }}
                >
                    See all
                </button>
            </div>
            <div
                className="flex gap-3 mb-6
      overflow-x-auto flex-nowrap  hide-scrollbar px-1
      md:overflow-x-visible md:flex-wrap md:justify-center
      lg:overflow-x-visible lg:flex-wrap lg:justify-center"
            >
                {categories.map((yes) => (
                    <button
                        key={yes}
                        onClick={() => setSelected(yes)}
                        className={`
          min-w-[90px] px-4 py-1  text-[13px] rounded-full text-sm border transition size-7
          ${
              selected === yes
                  ? "text-green-600 font-bold border-green-500"
                  : "text-gray-600 border-gray-600"
          }
        `}
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
