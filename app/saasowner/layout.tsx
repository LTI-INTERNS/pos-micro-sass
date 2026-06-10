import SaasOwnerLayout from "@/components/SaasOwner/SaasOwnerLayout";

export const metadata = {
  title: "SaaS Owner Console",
};

export default function SaasOwnerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SaasOwnerLayout>{children}</SaasOwnerLayout>;
}
