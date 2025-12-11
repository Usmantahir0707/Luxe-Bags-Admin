import { motion } from "motion/react"

export default function ModalWrapper({ children, onClose }) {
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose} // Close on backdrop click
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg space-y-4 overflow-y-auto max-h-[90vh] border border-gray-200"
          onClick={(e) => e.stopPropagation()} 
        >
          {children}
        </motion.div>
      </motion.div>
  )   
}
