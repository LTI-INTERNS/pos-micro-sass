import DetailsForm from "@/components/Admin/settings/Details/DetailsForm";

type CompanyDetailsProps = {
  initial?: {
    name: string;
    regNo?: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
  };
  logoUrl?: string | null;
  onLogoChange?: (url: string | null, file?: File | null) => void;
  onSave?: (data: {
    name: string;
    regNo?: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
  }) => Promise<void> | void;
  readOnly?: boolean;
  onEditClick?: () => void;
  className?: string;
};

export default function CompanyDetailsForm(props: CompanyDetailsProps) {
  return <DetailsForm {...props} includeLogo={true} />;
}