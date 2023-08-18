export const addToCart = async (item: any) => {
  const cartItems = localStorage.getItem("cartItems");
  if (!cartItems) {
    localStorage.setItem("cartItems", JSON.stringify([item]));
    return;
  } else {
    const parsedCartItems = JSON.parse(cartItems);
    const existingItem = parsedCartItems.find((i) => i._id === item._id);
    if (existingItem) {
      const newCartItems = parsedCartItems.map((i) => {
        if (i._id === item._id) {
          return {
            ...i,
            quantity: i.quantity + item.quantity,
          };
        }
        return i;
      });
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
      return;
    }
    localStorage.setItem(
      "cartItems",
      JSON.stringify([...parsedCartItems, item])
    );
  }
};
