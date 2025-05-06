import { authenticateUser } from "@/actions/user";
import LeadForm from "@/components/lead-action-form/LeadForm";

const page = async () => {
  const auth = await authenticateUser();

  if (!auth || !auth.data) {
    return;
  }

  return <LeadForm mode="create" userId={auth.data.id} />;
};

export default page;
