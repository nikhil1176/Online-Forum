import { motion } from "framer-motion";

export default function Button({ children, className="", ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`px-4 py-2 rounded-lg font-medium bg-primary text-white hover:bg-blue-600 transition ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
