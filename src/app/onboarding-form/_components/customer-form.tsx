"use client";

import Input from "@/components/Input";
import { Customer } from "@/lib/types";
import { customerFormSchema } from "@/utils/validations";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CustomerFormData = z.infer<typeof customerFormSchema>;

type Props = {
  onFormChange?: (isValid: boolean) => void;
  formData: Customer;
  setFormData: (customer: Customer) => void;
};

export default function CustomerForm({
  onFormChange,
  formData,
  setFormData,
}: Props) {
  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress || "";
  const {
    register,
    watch,
    formState: { errors, isValid, touchedFields },
    setValue,
    trigger,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    mode: "onChange",
    defaultValues: {
      sharing_preference: formData.sharing_preference as
        | "custom"
        | "private"
        | "public"
        | "pre_existing"
        | "templated",
      roof_materials: (formData.roof_materials || []).map((material) =>
        ["shingle", "metal", "tile", "cedar"].includes(material)
          ? material
          : undefined,
      ) as [
        ("shingle" | "metal" | "tile" | "cedar" | undefined)?,
        ...("shingle" | "metal" | "tile" | "cedar" | undefined)[],
      ],
      prices: formData.prices || {},
      booking_link: formData.booking_link,
      company_name: formData.company_name,
      name: formData.name,
      company_website: formData.company_website,
      webhook_url: formData.webhook_url,
      inbound_phone: formData.inbound_phone,
      waste_factor: formData.waste_factor,
    },
  });

  const selectedRoofMaterials = watch("roof_materials") || [];
  const prices = watch("prices") || {};

  useEffect(() => {
    if (email) {
      setValue("email", email);
      setFormData({ ...formData, email: email });
    }
  }, [email, setValue]);

  useEffect(() => {
    if (onFormChange) {
      onFormChange(isValid);
    }
    trigger();
  }, [isValid, onFormChange, trigger]);

  const handleRadioChange = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, sharing_preference: e.target.value });
  };

  const handleCheckboxChange = (
    material: "shingle" | "metal" | "tile" | "cedar",
  ) => {
    const newMaterials = selectedRoofMaterials.includes(material)
      ? selectedRoofMaterials.filter((m) => m !== material)
      : [...selectedRoofMaterials, material];

    if (newMaterials.length > 0) {
      setValue(
        "roof_materials",
        newMaterials as [
          "shingle" | "metal" | "tile" | "cedar",
          ...("shingle" | "metal" | "tile" | "cedar")[],
        ],
      );
    }
    setFormData({
      ...formData,
      roof_materials: newMaterials,
      prices: Object.fromEntries(
        Object.entries(formData.prices || {}).filter(([key]) =>
          newMaterials.includes(key as "shingle" | "metal" | "tile" | "cedar"),
        ),
      ),
    });
    trigger("roof_materials");
  };

  const handlePriceChange = (
    material: string,
    field: "low" | "high",
    value: string,
  ) => {
    const newPrices = {
      ...prices,
      [material]: {
        ...(prices[material as "shingle" | "metal" | "tile" | "cedar"] || {
          low: "",
          high: "",
        }),
        [field]: value,
      },
    };

    setValue("prices", newPrices);
    setFormData({
      ...formData,
      prices: newPrices,
    });
    trigger("prices");
  };

  return (
    <form className="mx-auto w-full p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Name"
          name="name"
          placeholder="Name..."
          register={register}
          required
          value={formData?.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={touchedFields.name ? errors.name : undefined}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Email..."
          register={register}
          required
          value={email}
          disabled
        />
        <Input
          label="Company Name"
          name="company_name"
          placeholder="Company Name..."
          required
          value={formData?.company_name}
          onChange={(e) =>
            setFormData({ ...formData, company_name: e.target.value })
          }
          register={register}
          error={touchedFields.company_name ? errors.company_name : undefined}
        />
        <Input
          label="Company Website"
          name="company_website"
          placeholder="https://example.com"
          register={register}
          value={formData?.company_website}
          onChange={(e) =>
            setFormData({ ...formData, company_website: e.target.value })
          }
          error={errors.company_website}
        />
        <Input
          label="Webhook URL"
          name="webhook_url"
          placeholder="https://webhook.example.com"
          register={register}
          value={formData?.webhook_url}
          onChange={(e) =>
            setFormData({ ...formData, webhook_url: e.target.value })
          }
          error={errors.webhook_url}
        />
        <Input
          label="Inbound Phone"
          name="inbound_phone"
          type="number"
          placeholder="+1234567890"
          register={register}
          value={formData?.inbound_phone}
          onChange={(e) =>
            setFormData({ ...formData, inbound_phone: e.target.value })
          }
          error={errors.inbound_phone}
        />
        <Input
          label="Booking Link"
          name="booking_link"
          placeholder="https://calendly.com/example"
          register={register}
          value={formData?.booking_link}
          onChange={(e) =>
            setFormData({ ...formData, booking_link: e.target.value })
          }
          error={errors.booking_link}
        />
        <div className="mb-4 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold">
            How Would you like to share your roofing quote easy calculator?
          </h2>

          <div>
            <div className="space-y-2">
              <Input
                label="I want to keep it private"
                name="sharing_preference"
                type="radio"
                radioValue="private"
                register={register}
                checked={formData.sharing_preference === "private"}
                onChange={handleRadioChange}
                error={errors.sharing_preference}
              />
              <Input
                label="I want to make it public"
                name="sharing_preference"
                type="radio"
                radioValue="public"
                register={register}
                checked={formData.sharing_preference === "public"}
                onChange={handleRadioChange}
                error={errors.sharing_preference}
              />
              <Input
                label="I would like to add it to a pre-existing website or landing page"
                name="sharing_preference"
                type="radio"
                radioValue="pre_existing"
                register={register}
                checked={formData.sharing_preference === "pre_existing"}
                onChange={handleRadioChange}
                error={errors.sharing_preference}
              />
              <Input
                label="I would like for you to host my landing page for me (templated)"
                name="sharing_preference"
                type="radio"
                radioValue="templated"
                register={register}
                checked={formData.sharing_preference === "templated"}
                onChange={handleRadioChange}
                error={errors.sharing_preference}
              />
              <Input
                label="I would like to have you develop a 100% custom lander tailored to my roofing company"
                name="sharing_preference"
                type="radio"
                radioValue="custom"
                register={register}
                checked={formData.sharing_preference === "custom"}
                onChange={handleRadioChange}
                error={errors.sharing_preference}
              />
            </div>
          </div>
        </div>

        <div className="mb-4 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold">
            What roof materials do you offer?{" "}
            <span className="text-error">*</span>
          </h2>

          <div className="space-y-2">
            {["shingle", "metal", "tile", "cedar"].map((material) => (
              <div key={material} className="">
                <Input
                  type="checkbox"
                  name={material}
                  label={material}
                  id={`roof_material_${material}`}
                  checked={selectedRoofMaterials.includes(
                    material as "shingle" | "metal" | "tile" | "cedar",
                  )}
                  onChange={() =>
                    handleCheckboxChange(
                      material as "shingle" | "metal" | "tile" | "cedar",
                    )
                  }
                  register={register}
                />
              </div>
            ))}
          </div>
          {errors.roof_materials && (
            <p className="mt-1 text-sm text-[var(--color-error)]">
              {errors.roof_materials?.message}
            </p>
          )}
        </div>

        {selectedRoofMaterials.length > 0 && (
          <div className="mb-4 md:col-span-2">
            <h2 className="mb-4 text-xl font-bold">Price Ranges</h2>
            {selectedRoofMaterials.map((material) => (
              <div key={material} className="mb-6">
                <h3 className="mb-2 text-lg font-semibold capitalize">
                  {material}
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    label="Low Price"
                    name={`prices.${material}.low`}
                    type="number"
                    required
                    placeholder="100.00"
                    register={register}
                    value={prices[material]?.low || ""}
                    onChange={(e) =>
                      handlePriceChange(material, "low", e.target.value)
                    }
                    error={
                      touchedFields.prices?.[material]?.low
                        ? errors.prices?.[material]?.low
                        : undefined
                    }
                  />
                  <Input
                    label="High Price"
                    name={`prices.${material}.high`}
                    type="number"
                    required
                    placeholder="200.00"
                    register={register}
                    value={prices[material]?.high || ""}
                    onChange={(e) =>
                      handlePriceChange(material, "high", e.target.value)
                    }
                    error={
                      touchedFields.prices?.[material]?.high
                        ? errors.prices?.[material]?.high
                        : undefined
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <Input
          label="Waste Factor"
          name="waste_factor"
          placeholder="7%"
          type="number"
          required
          register={register}
          value={formData?.waste_factor}
          onChange={(e) =>
            setFormData({ ...formData, waste_factor: e.target.value })
          }
          error={touchedFields.waste_factor ? errors.waste_factor : undefined}
        />
      </div>
    </form>
  );
}
