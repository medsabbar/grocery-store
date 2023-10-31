import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

function index() {
  const [items, setItems] = React.useState([]);

  useEffect(() => {
    const cart = localStorage.getItem("cartItems");
    if (cart) {
      setItems(JSON.parse(cart));
    }
  }, []);

  const { data } = useQuery(["cart", items], async () => {
    const res = await fetch(`/api/items/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: items.map((i) => i._id) }),
    });
    const json = await res.json();
    return json;
  });

  return (
    <div>
      {data?.map((item) => (
        <div className="flex items-center gap-4">
          <img src={item.images[0]} className="w-24" />
          <div className="flex flex-col">
            <div className="text-lg font-bold">{item.name}</div>
            <div className="text-sm">{item.description.slice(0, 50)}...</div>
            <div className="text-lg font-bold">${item.price}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default index;

export const getServerSideProps = async () => {
  return {
    props: {
      title: "Cart",
    },
  };
};
