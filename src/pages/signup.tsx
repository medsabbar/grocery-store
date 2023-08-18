import Input from "@/components/forms/Input";
import Tabs from "@/components/forms/Tabs";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useForm, FormProvider } from "react-hook-form";

const handleSubmit = async (data: any) => {
  const res = await fetch("/api/user/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  else
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
};

function Signup() {
  const methods = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });
  return (
    <div className="max-w-2xl w-full mx-auto bg-white p-4 rounded-md my-8 shadow-md">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Image
            src="/logo.png"
            alt="Picture of the author"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <h1 className="text-center text-2xl font-bold mb-4">Sign Up</h1>
          <Input name="name" label="Name" />
          <Input name="email" label="Email" />
          <Input name="password" label="Password" type="password" />
          <Tabs
            name="role"
            label="Role"
            options={[
              { value: "user", label: "User" },
              { value: "seller", label: "Seller" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <button
            className="block mx-auto bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Submit
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Signup;
