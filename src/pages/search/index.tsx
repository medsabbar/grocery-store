import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function index() {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/");
  }, [replace]);

  return null;
}

export default index;
