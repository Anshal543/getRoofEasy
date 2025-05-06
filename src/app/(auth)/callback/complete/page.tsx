import { onSignUpUser } from "@/actions/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-up");

  const response = await onSignUpUser(
    user.id,
    user.emailAddresses[0]?.emailAddress,
  );
  if (
    response.status == 200 &&
    response.data.email &&
    response.data.status == "active"
  ) {
    return redirect("/dashboard");
  }

  if (response.status === 200) {
    return redirect("/onboarding-form");
  } else {
    return redirect("/sign-in");
  }
};

export default page;
