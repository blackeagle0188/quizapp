import React from "react";
import { Setting } from "@/components/settings";
import { auth } from "@/auth";
const SettingsPage = async () => {
  const session = await auth();
  return (
    <section className="w-full  sm:w-[40%]">
      <Setting session={session} />
    </section>
  );
};

export default SettingsPage;
