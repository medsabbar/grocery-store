import CategoryItems from "@/components/CategoryItems";
import Front from "@/components/Front";
import { Categories } from "@/lib/Constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillHourglass, AiOutlineSearch } from "react-icons/ai";

export default function Home() {
  const [search, setSearch] = useState("");
  const { push } = useRouter();
  return (
    <div className="flex gap-8 flex-col items-center justify-center min-h-screen py-2">
      <div className="relative mx-auto flex gap-2 flex-wrap">
        <input
          type="text"
          className="md:w-96 w-full border rounded-full border-gray-300 p-2 px-10 shadow-md"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AiOutlineSearch className="inline-block absolute left-4 top-3 h-5 w-5 text-gray-500" />
        <button
          onClick={() => {
            if (!search) return;
            push(`/search/${search}`);
          }}
          className="bg-emerald-500 mx-auto hover:bg-emerald-600 text-white rounded-full px-4 py-2 shadow-md"
        >
          Search
        </button>
      </div>
      <Front />
      {Categories.map((category) => (
        <CategoryItems key={category} category={category} />
      ))}
    </div>
  );
}
