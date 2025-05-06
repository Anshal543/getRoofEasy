import { getDbUserIdFromClerk } from "@/lib/action";
import { fetchTableData } from "@/lib/data-service";
import { currentUser } from "@clerk/nextjs/server";
import LeadsClient from "./LeadsClient";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const user = await currentUser();
  const dbUserId = await getDbUserIdFromClerk(
    user?.emailAddresses[0]?.emailAddress!,
  );
  const page = Number(params.page) || 1;
  const pageSize = Number(params.page_size) || 20;
  const query = params.query;
  const sortOrder = params.sort_order;
  const initialData = await fetchTableData(
    page,
    pageSize,
    query || "",
    sortOrder,
    dbUserId!,
  );

  return (
    <LeadsClient
      key={`${page}-${pageSize}-${query}`}
      initialData={initialData}
      initialPage={page}
      initialPageSize={pageSize}
      initialQuery={query}
    />
  );
}
