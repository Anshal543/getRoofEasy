import { authenticateUser } from "@/actions/user";
import { RoofingPriceForm } from "@/components/roofing-prices/RoofingPricesList";
import { api } from "@/utils/axios";

async function fetchRoofingPrices(userId: number) {
  const respones = await api.get(`roofing-prices/${userId}/`);
  const results = respones.data.data;
  console.log("results", results);
  return results;
}

const page = async () => {
  const auth = await authenticateUser();

  if (!auth || !auth.data) {
    return;
  }

  const data = await fetchRoofingPrices(auth.data.id);

  return <RoofingPriceForm defaultValues={data} />;
};

export default page;
