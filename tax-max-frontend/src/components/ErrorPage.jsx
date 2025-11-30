import React from "react";

const ErrorPage = ({ error, message }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚠️ {error}</h1>
      <p style={styles.message}>{message}</p>
      <button style={styles.button} onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.2rem",
    marginBottom: "2rem",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ErrorPage;
