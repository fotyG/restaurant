import Image from "next/image";

const Featured = () => {
  return (
    <div className="w-screen">
      {/* WRAPPER */}
      <div className="">
        {/* SINGLE ITEM */}
        <div className="">
          {/* IMAGE CONTAINER */}
          <div className="relative">
            <Image
              src=""
              alt=""
              fill
            />
          </div>
          {/* TEXT CONTAINER */}
          <div className="">
            <h1 className="">Title</h1>
            <p>Desc</p>
            <span>12</span>
            <button>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Featured;
