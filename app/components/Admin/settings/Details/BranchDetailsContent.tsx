import DetailsForm from "./DetailsForm";

type BranchDetailsProps = {
  initial?: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
  };
  onSave?: (data: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
  }) => Promise<void> | void;
  readOnly?: boolean;
  onEditClick?: () => void;
  className?: string;
};

export default function BranchDetailsForm(props: BranchDetailsProps) {
  return <DetailsForm {...props} includeLogo={false} />;
}