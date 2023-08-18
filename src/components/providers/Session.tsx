import { useSession } from "next-auth/react";
import React, { ReactNode } from "react";

function Session({ children }: { children: ReactNode }) {
  const { data } = useSession();
  console.log("session", data?.user);
  return <div>{children}</div>;
}

export default Session;
