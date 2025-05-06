import { onSignInUser } from "@/actions/user";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const authenticated = await onSignInUser(user.emailAddresses[0].emailAddress);
  if (authenticated.status == 200) {
    return redirect("/dashboard");
  } else if (authenticated.status === 201) {
    return redirect("/onboarding-form");
  }
};

export default page;
