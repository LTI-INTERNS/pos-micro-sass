type RoleButtonProps = {
  label: string;
  onClick?: () => void;
};

export default function RoleButton({ label, onClick }: RoleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-8 py-3 rounded-full border border-white/30 text-white backdrop-blur-md bg-white/10 hover:bg-white/20 transition text-sm md:text-base"
    >
      {label}
    </button>
  );
}
