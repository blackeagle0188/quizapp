import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="w-full flex items-center relative sm:hidden  bg-transparent">
        <Image
          src="/mob_foot.svg"
          height={100}
          width={200}
          alt="foot svg"
          className="w-full aspect-auto absolute bottom-0 -z-10"
        />
        <div className="text-sm flex justify-center gap-8 items-center pb-4 w-full bg-transparent">
          <a href="/privacy" className="text-slate-400 font-bold mx-2">
            Privacy Policy
          </a>
          <a href="/terms" className="text-slate-400 font-bold mx-2">
            Terms of Service
          </a>
        </div>
      </footer>
      <footer className="w-full sm:flex items-center relative hidden bg-transparent ">
        <Image
          src="/desk_foot.svg"
          height={100}
          width={200}
          alt="foot svg"
          className="w-full aspect-auto absolute bottom-0 -z-10"
        />
        <div className="text-sm flex justify-center gap-8 items-center pb-4 w-full bg-transparent">
          <a href="/privacy" className="text-slate-400 font-bold mx-2">
            Privacy Policy
          </a>
          <a href="/terms" className="text-slate-400 font-bold mx-2">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
