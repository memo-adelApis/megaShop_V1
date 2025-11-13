import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
const Drawer = ({ open, onClose, side = "right", children, title }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="fixed inset-0 bg-black/30 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.aside
          className={`fixed ${
            side === "right" ? "right-0" : "left-0"
          } top-0 h-full w-[88%] sm:w-[420px] bg-white z-50 shadow-2xl`}
          initial={{ x: side === "right" ? 480 : -480 }}
          animate={{ x: 0 }}
          exit={{ x: side === "right" ? 480 : -480 }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="font-semibold text-lg">{title}</h4>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100vh-56px)]">
            {children}
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);
export default Drawer;
