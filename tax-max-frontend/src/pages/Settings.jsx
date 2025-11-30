import { motion } from "framer-motion";

function Settings() {
  return (
    <motion.div
      style={{ padding: "2rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Settings</h2>
      <p>Configure application settings here.</p>
    </motion.div>
  );
}

export default Settings;
