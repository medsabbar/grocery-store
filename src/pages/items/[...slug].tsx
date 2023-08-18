import ItemForm from "@/components/ItemForm";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { addToCart } from "@/lib/cart";

function Slug() {
  const { query } = useRouter();

  const id = useMemo(() => {
    if (!query?.slug) return null;
    if (query?.slug[0] === "create") {
      return null;
    }
    return query?.slug[1];
  }, [query?.slug]);

  const mode = useMemo(() => {
    if (!query?.slug) return "view";
    if (query?.slug[0] === "create") {
      return "create";
    }
    if (query?.slug[0] === "edit") {
      return "edit";
    }
    return "view";
  }, [query?.slug]);

  const { data: item } = useQuery(
    ["items", id],
    async () => {
      const res = await fetch(`/api/items?_id=${id}`);
      const json = await res.json();
      return json;
    },
    { enabled: !!id }
  );

  return mode === "view" ? (
    <ItemInfo item={item || {}} />
  ) : (
    <ItemForm mode={mode} item={query.slug} />
  );
}

export default Slug;

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

const ItemInfo = ({ item }: { item: any }) => {
  const [quantity, setQuantity] = React.useState(1);
  return (
    <div className="grid my-24 md:grid-cols-2 gap-2">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="max-w-xs"
        autoplay
      >
        {item.images?.map((image: any) => (
          <SwiperSlide>
            <img src={image} className="w-full" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="px-4 gap-4 grid">
        <div className="text-3xl font-bold">{item.name}</div>
        <div className="text-sm">{item.description}</div>
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
        <div className="grid items-end justify-end mt-4">
          <div className="flex gap-4">
            <div>Price</div>
            <div className="text-xl font-bold">${item.price}</div>
          </div>
          <div className="flex gap-4">
            <div>Total</div>
            <div className="text-xl font-bold">
              ${(item.price * quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
