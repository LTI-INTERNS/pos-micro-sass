type StaffReportItemProps = {
  name: string;
  avatar: string;
  amount: string;
  subAmount: string;
};

export default function StaffReportItem({
  name,
  avatar,
  amount,
  subAmount,
}: StaffReportItemProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">{amount}</p>
        <p className="text-xs text-green-500">{subAmount}</p>
      </div>
    </div>
  );
}
