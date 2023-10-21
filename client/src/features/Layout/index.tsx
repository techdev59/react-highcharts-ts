import { ReactNode } from "react";
import CustomizedAppBar from "./components/Appbar";

function Layout({ children }: { children: ReactNode }) {
  return (
    <main>
      <CustomizedAppBar />
      {children}
    </main>
  );
}

export default Layout;
