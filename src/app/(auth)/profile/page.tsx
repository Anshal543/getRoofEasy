"use client";
import { useUser } from "@clerk/clerk-react";
import React, { FormEvent, useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
};

type ClerkError = {
  errors?: { message: string }[];
};

function Profile() {
  const { isLoaded, user } = useUser();
  const [formState, setFormState] = useState<FormState>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center text-[var(--color-profile-loading)]">
        Loading...
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-[var(--color-profile-loading)]">
        Please sign in to view this page.
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await user.update({
        firstName: formState.firstName,
        lastName: formState.lastName,
      });

      if (formState.email !== user.primaryEmailAddress?.emailAddress) {
        await user.createEmailAddress({ email: formState.email });
        setSuccess(
          "Profile updated! Check your email to verify the new address.",
        );
      } else {
        setSuccess("Profile updated successfully!");
      }
    } catch (err: unknown) {
      const clerkErr = err as ClerkError;
      setError(clerkErr.errors?.[0]?.message || "An error occurred.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormState,
  ) => {
    setFormState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-[var(--color-profile-bg)] p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-[var(--color-profile-heading)]">
          Edit Profile
        </h1>
        {error && (
          <p className="mb-4 text-[var(--color-profile-error)]">{error}</p>
        )}
        {success && (
          <p className="mb-4 text-[var(--color-profile-success)]">{success}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-[var(--color-profile-label)]"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={formState.firstName}
              onChange={(e) => handleInputChange(e, "firstName")}
              className="mt-1 w-full rounded-md border border-[var(--color-profile-input-border)] px-3 py-2 focus:border-[var(--color-profile-input-focus)] focus:ring-1 focus:ring-[var(--color-profile-input-focus)] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-[var(--color-profile-label)]"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={formState.lastName}
              onChange={(e) => handleInputChange(e, "lastName")}
              className="mt-1 w-full rounded-md border border-[var(--color-profile-input-border)] px-3 py-2 focus:border-[var(--color-profile-input-focus)] focus:ring-1 focus:ring-[var(--color-profile-input-focus)] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--color-profile-label)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formState.email}
              onChange={(e) => handleInputChange(e, "email")}
              className="mt-1 w-full rounded-md border border-[var(--color-profile-input-border)] px-3 py-2 focus:border-[var(--color-profile-input-focus)] focus:ring-1 focus:ring-[var(--color-profile-input-focus)] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[var(--color-profile-button-bg)] px-4 py-2 text-[var(--color-profile-button-text)] hover:bg-[var(--color-profile-button-hover)] focus:ring-2 focus:ring-[var(--color-profile-input-focus)] focus:ring-offset-2 focus:outline-none"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
