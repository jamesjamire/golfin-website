import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "GOLFIN Admin",
  description: "Admin panel for GOLFIN website",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
