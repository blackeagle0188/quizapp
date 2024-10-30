"use client";

import Select, { ClearIndicatorProps } from "react-select";
import { CSSObject } from "@emotion/serialize";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface ColourOption {
  label: string;
  value: string;
}

const colourOptions: ColourOption[] = [
  { label: "Red", value: "red" },
  { label: "Orange", value: "orange" },
  { label: "Yellow", value: "yellow" },
];

export default function CustomClearIndicator() {
  return (
    <div className="w-full flex items-center flex-col gap-4">
      <div className="w-full">
        <Select
          closeMenuOnSelect={false}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              background:
                "linear-gradient(to bottom, #B9DCF6 0%, #B9DCF6 100%)",
              borderRadius: "50px",
              borderColor: state.isFocused ? "grey" : "white",
              outlineColor: "grey",
              boxShadow: "0 0 0 2px rgba(0,0,0,0.1)",
            }),
          }}
          defaultValue={[colourOptions[0]]}
          isMulti
          options={colourOptions}
          placeholder="Select a set "
        />
      </div>
      <Textarea
        rows={6}
        placeholder="Write the description of your set"
        className="resize-none bg-card border border-white shadow-md "
      />
      <Button className="uppercase">Generate Question</Button>
    </div>
  );
}
