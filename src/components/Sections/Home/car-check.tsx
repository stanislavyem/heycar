import * as React from "react";
import { ContactForm } from "@/app/blocks/contact-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/tabs";

const demoLinks = [
  "https://www.autotrader.com/cars-for-sale/vehicle/2021-toyota-rav4-xle",
  "https://www.cars.com/vehicledetail/2022-honda-civic-sport",
  "https://www.carmax.com/car/2020-ford-f-150-xlt",
];

function useTypedPlaceholder(texts: string[]) {
  const [value, setValue] = React.useState(texts[0]);
  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let index = 0;
    let chars = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const text = texts[index];
      chars += deleting ? -2 : 1;
      if (chars < 0) chars = 0;
      setValue(text.slice(0, chars) || " ");
      let delay = deleting ? 18 : 45;
      if (!deleting && chars >= text.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && chars <= 0) {
        deleting = false;
        index = (index + 1) % texts.length;
        delay = 400;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 1200);
    return () => clearTimeout(timer);
  }, [texts]);
  return value;
}

export function CarCheck() {
  const placeholder = useTypedPlaceholder(demoLinks);
  return (
    <Tabs defaultValue="link" className="max-w-2xl">
      <TabsList>
        <TabsTrigger value="link">Paste a car link</TabsTrigger>
        <TabsTrigger value="manual">Enter details manually</TabsTrigger>
      </TabsList>
      <TabsContent value="link" keepMounted={false} className="mt-8">
        <ContactForm
          formId="car-link-check"
          fields={[
            { name: "url", label: "Listing link", required: true, placeholder },
            { name: "email", label: "Email for your report", type: "email", required: true },
          ]}
          submitLabel="Check this car, $499"
          successMessage="Got it. We will email your report as soon as it is ready."
        />
      </TabsContent>
      <TabsContent value="manual" keepMounted={false} className="mt-8">
        <ContactForm
          formId="car-details-check"
          fields={[
            { name: "year", label: "Year", required: true, half: true, placeholder: "2021" },
            { name: "make", label: "Make", required: true, half: true, placeholder: "Toyota" },
            { name: "model", label: "Model", required: true, half: true, placeholder: "RAV4" },
            { name: "trim", label: "Trim", half: true, placeholder: "XLE" },
            { name: "mileage", label: "Mileage", required: true, half: true, placeholder: "42,000" },
            { name: "price", label: "Asking price", required: true, half: true, placeholder: "$27,900" },
            { name: "condition", label: "Condition", type: "select", options: ["Excellent", "Good", "Fair", "Needs work"], placeholder: "Choose one", half: true },
            { name: "zip", label: "ZIP code", half: true, placeholder: "90210" },
            { name: "vin", label: "VIN (optional)" },
            { name: "email", label: "Email for your report", type: "email", required: true },
          ]}
          submitLabel="Check this car, $499"
          successMessage="Got it. We will email your report as soon as it is ready."
        />
      </TabsContent>
    </Tabs>
  );
}
