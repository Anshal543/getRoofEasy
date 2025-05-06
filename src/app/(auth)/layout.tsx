import { ReactNode } from "react";
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <div className="radial--blur pointer-events-none absolute inset-0 top-1/2 left-1/2 z-0 mx-10 h-4/6 w-3/6 -translate-x-1/2 -translate-y-1/2 transform rounded-[50%] opacity-40" />
      {children}
    </div>
  );
};

export default Layout;
