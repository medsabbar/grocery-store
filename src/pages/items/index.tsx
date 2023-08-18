import Restricted from "@/components/Restricted";
import React from "react";

function index() {
  return (
    <Restricted to="admin" fallback={true}>
      Items
    </Restricted>
  );
}

export default index;
