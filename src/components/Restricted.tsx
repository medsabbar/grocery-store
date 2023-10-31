import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import Spinner from "./Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiFillWarning } from "react-icons/ai";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Restricted({
  children,
  to,
  fallback,
}: {
  children: React.ReactNode;
  to: string;
  fallback?: boolean;
}) {
  const { data, status } = useSession();
  const [show, setShow] = React.useState(false);
  useEffect(() => {
    if (data?.user) {
      console.log(data?.user.role);
      console.log(to);
      if (Array.isArray(to)) {
        setShow(to.includes(data.user.role));
      } else {
        console.log("here");
        setShow(data.user.role === to);
      }
    }
  }, [data?.user]);

  if (status === "loading")
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={10} />
      </div>
    );

  if (!show) {
    return fallback ? (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <AiFillWarning className="w-24 h-24 mx-auto text-red-400" />
          </CardContent>
          <CardFooter>
            <Alert severity="warning">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                You are not allowed to access this page.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    ) : null;
  }
  return children;
}

export default Restricted;
