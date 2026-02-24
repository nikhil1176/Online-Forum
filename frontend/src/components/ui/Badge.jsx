export default function Badge({ label, type="default" }) {
  const colors = {
    default: "bg-gray-200 text-gray-800",
    approved: "bg-success/20 text-success",
    rejected: "bg-danger/20 text-danger",
    pending: "bg-yellow-200 text-yellow-800",
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-md font-medium ${colors[type]}`}>
      {label}
    </span>
  );
}
