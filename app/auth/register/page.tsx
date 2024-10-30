import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";

const RegisterPage = () => {
  return (
    <div className="flex gap-4 sm:gap-[3rem] flex-col md:flex-row  justify-center items-center my-8 ">
      <h2 className="sm:hidden leading-4 text-2xl md:text-3xl font-semibold mb-6">
        Create Account
      </h2>
      <div className="-translate-x-6 translate-y-4 sm:translate-x-0 sm:translate-y-0 ">
        <Image
          src="/register.svg"
          alt="mascot"
          width={400}
          height={400}
          className="h-[300px] w-[300px] md:h-[400px] md:w-[400px]"
        />
      </div>
      <div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
