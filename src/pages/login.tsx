import Input from "@/components/forms/Input";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import SubmitBTN from "@/components/SubmitBTN";

export const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const handleSubmit = async (data: any, setError: any) => {
  const res = await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });
  if (res?.error === "User not found") {
    setError("User not found");
  } else if (res?.error === "Password does not match") {
    console.log("Password does not match");
    setError("Password does not match");
  }
};

function Login() {
  const { data } = useSession();
  const { replace } = useRouter();
  const [error, setError] = React.useState<any>("");
  const [submitting, setSubmitting] = React.useState<any>(false);

  useEffect(() => {
    if (data?.user) {
      replace("/");
    }
  }, [data]);

  const methods = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
  });

  return (
    <div className="max-w-2xl w-full mx-auto bg-white p-4 rounded-md my-8 shadow-md">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) => {
            setError("");
            setSubmitting(true);
            handleSubmit(data, setError).then(() => setSubmitting(false));
          })}
        >
          <Image
            src="/logo.png"
            alt="Picture of the author"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <h1 className="text-center text-2xl font-bold mb-4">Log In</h1>
          <Input name="email" label="Email" />
          <Input name="password" label="Password" type="password" />
          {error && (
            <p className="text-center mb-4 text-red-500 text-xs italic">
              {error}
            </p>
          )}
          <SubmitBTN isSubmitting={submitting} text="Log In" />
        </form>
      </FormProvider>
      <div className="flex">
        <p className="mx-auto mt-4">
          Don&apos;t have an account?{" "}
          <Link
            className="text-emerald-500 hover:text-emerald-700"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
