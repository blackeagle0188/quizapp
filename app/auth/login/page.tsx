import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-center mt-6 md:mt-0 gap-8  w-full">
      <LoginForm />
      <Image
        src="/login.svg"
        alt="login-moscow"
        width={400}
        height={400}
        className="h-[300px] w-[300px] md:h-[400px] md:w-[400px]"
      />
    </div>
  );
};

export default LoginPage;
