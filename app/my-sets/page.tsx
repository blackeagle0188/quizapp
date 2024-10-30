import { getSets } from "@/actions/set";
import { ButtonGrp } from "@/components/button-group";
import { GradientCard } from "@/components/gradient-card";
import { Set } from "@/components/set";
import React from "react";

const MySets = async () => {
  const result = await getSets();
  return (
    <section className="w-full sm:w-[40%] space-y-6 ">
      <div className="w-[90%] space-y-4 mx-auto mt-4 sm:mt-0">
        <GradientCard>
          {result.data?.map((set) => (
            <Set set={set} key={set.id} />
          ))}
        </GradientCard>
        <ButtonGrp back next="Add Set" />
      </div>
    </section>
  );
};

export default MySets;
