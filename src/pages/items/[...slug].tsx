import ItemForm from "@/components/ItemForm";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

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
  return (
    <div className="grid my-24 md:grid-cols-2 gap-2">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
        autoplay
      >
        {item.images?.map((image: any) => (
          <SwiperSlide>
            <img src={image} className="w-full" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div>
        <div className="text-3xl font-bold">{item.name}</div>
        <div className="text-sm">{item.description}</div>
        <div className="text-lg font-bold">${item.price}</div>
      </div>
    </div>
  );
};
