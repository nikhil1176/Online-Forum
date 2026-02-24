import React from 'react';
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { motion } from "framer-motion";

export default function VoteBox({ score, onUpvote, onDownvote }) {
  return (
    <div className="flex flex-col items-center gap-1 text-gray-500">
      <motion.button whileTap={{ scale: 0.8 }} onClick={onUpvote}>
        <ArrowBigUp className="hover:text-primary cursor-pointer" size={22} />
      </motion.button>

      <span className="font-semibold">{score}</span>

      <motion.button whileTap={{ scale: 0.8 }} onClick={onDownvote}>
        <ArrowBigDown className="hover:text-danger cursor-pointer" size={22} />
      </motion.button>
    </div>
  );
}
