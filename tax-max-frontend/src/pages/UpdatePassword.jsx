import { useState } from "react";
import { motion } from "framer-motion";
import "./../styles/UpdatePassword.css";

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = () => {
    if (newPassword) {
      alert("Password updated!");
      // Wire to PUT /api/users/:username/password later
      setNewPassword("");
    }
  };

  const handleFinish = () => {
    alert("Returning to profile...");
    // navigate("/user-profile") or close modal
  };

  return (
    <motion.div
      className="update-password"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>PASSWORD UPDATE</h2>

      <div className="form">
        <input
          type="password"
          placeholder="NEW PASSWORD"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleUpdate}>UPDATE</button>
        <button onClick={handleFinish}>FINISH</button>
      </div>
    </motion.div>
  );
}

export default UpdatePassword;
