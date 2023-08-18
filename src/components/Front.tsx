import React from "react";

function Front() {
  return (
    <div className="grid md:grid-cols-2 p-4 gap-2">
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="text-4xl font-bold">Welcome to the</h1>
        <h1 className="text-4xl font-bold">Future of Shopping</h1>
        <h1 className="text-4xl font-bold">Experience</h1>
        <h1 className="text-4xl font-bold">with</h1>
        <h1 className="text-4xl font-bold text-emerald-700">Grocery Store</h1>
      </div>
      <img src="/woman_in_store.png" />
    </div>
  );
}

export default Front;
