import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { PaletteProvider } from '@/components/palette/PaletteProvider';
import "@/lib/auth/storage-event";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <div className="relative flex min-h-screen w-full bg-background">
        {/* Ambient gradients (very subtle for app shell) */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-1/4 left-1/3 h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.6_0.245_262.881/.15),transparent_65%)] blur-3xl" />
          <div className="absolute -bottom-1/3 right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.7_0.18_290/.1),transparent_60%)] blur-3xl" />
        </div>
        <AppSidebar />
        <SidebarInset className="bg-transparent">{children}</SidebarInset>
        <PaletteProvider />
      </div>
    </SidebarProvider>
  );
}
