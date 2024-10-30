import Image from "next/image";
import React from "react";

const notFound = () => {
  return (
    <section className="flex items-center justify-center flex-col">
      <h2 className="text-center text-xl text-white">
        Looks like the resource you are <br /> looking for can not be found.
      </h2>

      <Image
        src="/not-found.svg"
        alt="not found avatar"
        height={100}
        width={100}
        className=" h-[200px] w-[250px] sm:h-[300px] sm:w-[350px] "
      />
    </section>
  );
};

export default notFound;
