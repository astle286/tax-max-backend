import { motion } from "framer-motion";

function Exports() {
  return (
    <motion.div
      style={{ padding: "2rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Exports</h2>
      <p>Generate and download export reports here.</p>
    </motion.div>
  );
}

export default Exports;
