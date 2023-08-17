"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
};

type Option = {
  title: string;
  additionalPrice: number;
};

const AddPage = () => {
  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: "",
  });

  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });

  const [file, setFile] = useState<File>();
  const [options, setOptions] = useState<Option[]>([]);

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOption((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const item = (target.files as FileList)[0];
    setFile(item);
  };

  const upload = async () => {
    const data = new FormData();
    data.append("file", file!);
    data.append("upload_preset", "restaurant");
    const res = await fetch("https://api.cloudinary.com/v1_1/dyx4cpd2a/image", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: data,
    });

    const resData = await res.json();
    return resData.url;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const url = await upload();
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: JSON.stringify({
          img: url,
          ...inputs,
          options,
        }),
      });

      const data = await res.json();
      // router.push(`/product/${data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form
        className="shadow-lg flex flex-wrap gap-4 p-8 "
        onSubmit={handleSubmit}
      >
        <h1>Add New Product</h1>
        <div className="w-full flex flex-col gap-2">
          <label>Image</label>
          <input
            type="file"
            onChange={handleChangeImg}
            className="ring-1 ring-red-200 p-2 rounded-sm"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Title</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-2 rounded-sm"
            type="text"
            name="title"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Description</label>
          <textarea
            onChange={handleChange}
            name="desc"
            className="ring-1 ring-red-200 p-2 rounded-sm"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Price</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-2 rounded-sm"
            type="number"
            name="price"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Category</label>
          <input
            onChange={handleChange}
            className="ring-1 ring-red-200 p-2 rounded-sm"
            type="text"
            name="catSlug"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label>Options</label>
          <div className="flex gap-2">
            <input
              onChange={changeOption}
              className="ring-1 ring-red-200 p-2 rounded-sm"
              type="text"
              placeholder="Title"
              name="title"
            />
            <input
              onChange={changeOption}
              className="ring-1 ring-red-200 p-2 rounded-sm"
              type="number"
              placeholder="Additional Price"
              name="additionalPrice"
            />
          </div>
          <div
            className="w-52 bg-red-500 text-white p-2 hover:cursor-pointer"
            onClick={() => setOptions((prev) => [...prev, option])}
          >
            Add Option
          </div>
        </div>
        <div className="flex gap-2">
          {options.map((option) => (
            <div
              key={option.title}
              className="ring-1 p-2 ring-red-500 rounded-md hover:cursor-pointer"
              onClick={() =>
                setOptions(options.filter((opt) => opt.title !== option.title))
              }
            >
              <span>{option.title}</span>
              <span>${option.additionalPrice}</span>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="p-2 w-full bg-red-500 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
export default AddPage;
