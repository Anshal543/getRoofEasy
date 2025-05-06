import { authenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await authenticateUser();
  if (user?.status == 401 || user.status == 500 || !user.data) {
    redirect("/sign-in");
  }
  redirect("/dashboard");
};

export default page;
