export default function Card({ children, className="" }) {
  return (
    <div className={`bg-card rounded-xl shadow-md p-4 border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}
