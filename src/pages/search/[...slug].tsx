import { Item } from "@/components/CategoryItems";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { AiOutlineSearch } from "react-icons/ai";

function Slug() {
  const { query, push } = useRouter();
  const [searchValue, setSearch] = React.useState("");

  const search = useMemo(() => {
    setSearch(query?.slug[0]);
    return query?.slug[0];
  }, [query?.slug]);

  const { data: items } = useQuery(
    ["items", search],
    async () => {
      const res = await fetch(`/api/items/search?search=${search}`);
      const json = await res.json();
      return json;
    },
    { enabled: !!search }
  );

  if (!search) {
    return null;
  }

  console.log("items", items);

  return (
    <div className="flex flex-col mx-4 items-center justify-start py-2 gap-4 my-12">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push(`/search/${searchValue}`);
        }}
        className="relative mx-auto flex gap-2 flex-wrap"
      >
        <input
          type="text"
          className="md:w-96 w-full border rounded-full border-gray-300 p-2 px-10 shadow-md"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AiOutlineSearch className="inline-block absolute left-4 top-3 h-5 w-5 text-gray-500" />
        <button
          onClick={() => {
            if (!searchValue) return;
            push(`/search/${searchValue}`);
          }}
          className="bg-emerald-500 mx-auto hover:bg-emerald-600 text-white rounded-full px-4 py-2 shadow-md"
        >
          Search
        </button>
      </form>
      <div className="text-3xl font-bold">Search Results for {search}</div>
      <div className="grid md:grid-cols-3 gap-8">
        {items?.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Slug;

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};
