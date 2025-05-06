import { authenticateUser } from "@/actions/user";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/breadcrumb/Breadcrumbs";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await authenticateUser();

  if (!auth || !auth.data) {
    return;
  }

  return (
    <>
      <Sidebar />
      <Navbar userId={auth.data.id} />
      <Breadcrumbs />
      {children}
    </>
  );
}
