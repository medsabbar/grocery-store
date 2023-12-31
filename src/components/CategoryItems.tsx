import { addToCart } from "@/lib/cart";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  AiFillMinusCircle,
  AiFillPlusCircle,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";
import Spinner from "./Spinner";

function CategoryItems({ category }: { category: string }) {
  const { data: items, isFetching } = useQuery(
    ["items", category],
    async () => {
      const res = await fetch(`/api/items/?category=${category}&pageSize=4`);
      const json = await res.json();
      return json;
    },
    { enabled: !!category, refetchOnWindowFocus: false }
  );
  return (
    <div className="flex flex-col mx-4 items-center justify-start py-2 gap-4 my-12">
      <div className="text-3xl font-bold">{category}</div>
      {isFetching ? (
        <div className="flex items-center justify-center">
          <Spinner size={20} />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {items?.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryItems;

export const Item = ({ item }: { item: any }) => {
  const [quantity, setQuantity] = React.useState(1);
  return (
    <div className="w-full grid gap-2 bg-emerald-50 p-2 shadow rounded overflow-hidden hover:bg-emerald-100">
      <Link href={`/items/view/${item._id}`}>
        <div className="text-lg font-bold">{item.name}</div>
        <div className="text-sm">{item.description.slice(0, 50)}...</div>
        <div className="relative">
          <Image
            src={item.images[0]}
            className="w-full"
            width={300}
            height={300}
            alt={item.name}
          />
          <div className="absolute top-2 left-2 bg-white rounded-full px-2 text-lg font-bold text-end">
            ${item.price}
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AiFillMinusCircle
            onClick={() => {
              if (quantity === 1) return;
              setQuantity(quantity - 1);
            }}
            className="cursor-pointer text-red-500"
          />
          <input
            className="w-16 text-center"
            value={quantity}
            onChange={(e) => {
              // if NaN
              if (isNaN(parseInt(e.target.value))) return;
              if (parseInt(e.target.value) >= 99) {
                setQuantity(99);
                return;
              }
              setQuantity(parseInt(e.target.value));
            }}
          />
          <AiFillPlusCircle
            onClick={() => {
              if (quantity === 99) return;
              setQuantity(quantity + 1);
            }}
            className="cursor-pointer text-green-500"
          />
        </div>
        <button
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-4 py-2 shadow-md"
          onClick={() => {
            addToCart({
              _id: item._id,
              quantity,
            });
            setQuantity(1);
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className="w-full grid gap-2 bg-emerald-50 p-2 shadow rounded overflow-hidden hover:bg-emerald-100">
      <div className="w-full animate-pulse bg-emerald-100 h-4"></div>
      <div className="w-full animate-pulse bg-emerald-100 h-24"></div>
      <div className="w-full animate-pulse bg-emerald-100 h-24"></div>
      <div className="w-full animate-pulse bg-emerald-100 h-4"></div>
    </div>
  );
};
