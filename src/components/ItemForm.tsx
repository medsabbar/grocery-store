import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import Input from "./forms/Input";
import TextArea from "./forms/TextArea";
import { useSession } from "next-auth/react";
import mongoose from "mongoose";
import ImagesToBase64 from "./forms/Images";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { storage } from "@/lib/firebaseConfig";
import { useToast } from "@/components/ui/use-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SubmitBTN from "./SubmitBTN";
import Select from "./forms/Select";
import { Categories } from "@/lib/Constants";

const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  category: yup.string().required(),
  images: yup.array().required().min(1),
});

function ItemForm({ mode, item }: { mode: "create" | "edit"; item?: any }) {
  const { data: session } = useSession();
  const [submitting, setSubmitting] = React.useState<any>(false);
  const { toast } = useToast();
  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      images: [],
      category: "",
    },
    resolver: yupResolver(schema),
  });
  const handleSubmit = async (data: any) => {
    const _id = new mongoose.Types.ObjectId().toString();

    const base64ToImageFile = async (dataURI: string, fileName: string) => {
      const byteString = atob(dataURI.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: "image/jpeg" });
      return new File([blob], fileName, { type: "image/jpeg" });
    };

    const promises = data.images.map(async (image: any, i) => {
      const theImage = await base64ToImageFile(image, `${_id}-${i}.jpg`);
      const storageRef = ref(storage, `items/${_id}/${i}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, theImage);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    });

    const images = await Promise.all(promises);

    const res = await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        _id,
        ownerId: session?.user?.id,
        images,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    if (!res.ok) {
      toast({
        title: "Error",
        description: json.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Item created successfully",
        variant: "default",
        style: {
          backgroundColor: "green",
          color: "white",
        },
      });
      methods.reset({
        name: "",
        description: "",
        price: 0.01,
        images: [],
        category: "",
      });
    }
  };

  return (
    <div className="max-w-xl my-12 m-auto bg-white py-8 px-4 rounded shadow">
      <h1 className="text-2xl text-center font-bold mb-4">
        {mode === "create" ? "Create" : "Edit"} Item
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Input name="name" label="Name" />
          <TextArea name="description" label="Description" />
          <Input name="price" label="Price" />
          <Select
            name="category"
            label="Category"
            options={Categories.map((c) => ({
              value: c,
              label: c,
            }))}
          />
          <ImagesToBase64 name="images" label="Images" />
          <SubmitBTN isSubmitting={submitting} text="Submit" />
        </form>
      </FormProvider>
    </div>
  );
}

export default ItemForm;
