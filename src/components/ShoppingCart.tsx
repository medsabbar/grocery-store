import Link from "next/link";
import React, { useEffect } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";

function ShoppingCart() {
  const [items, setItems] = React.useState([
    {
      id: 1,
      name: "Product 1",
      price: 100,
      quantity: 1,
      image: "https://picsum.photos/200/300",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cart = localStorage.getItem("cart");
      if (cart) {
        setItems(JSON.parse(cart));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Link className="relative opacity-100 hover:opacity-80" href="/cart">
      <AiOutlineShoppingCart className="inline-block w-6 h-6" />
      {items.length > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {items.length}
        </span>
      )}
    </Link>
  );
}

export default ShoppingCart;
