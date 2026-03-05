import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
}
