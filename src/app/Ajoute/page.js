"use client"; 

import React, { useState, useContext } from "react";

export default function Page() {
  const { exams, addExam } = useContext(ExamContext);
  const [newExamName, setNewExamName] = useState("");
  const [newExamDate, setNewExamDate] = useState("");
  const [newExamType, setNewExamType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newExamName);
    formData.append("date", newExamDate);
    formData.append("type", newExamType);
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout de l'examen");
      }

      const data = await res.json();
      addExam(data.exam);

      // Réinitialisation du formulaire
      setNewExamName("");
      setNewExamDate("");
      setNewExamType("");
      setSelectedFile(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'examen :", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Tableau de Bord - Examens</h1>

      <button onClick={() => setIsModalOpen(true)} style={styles.addButton}>
        Ajouter un Examen
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.subtitle}>Ajouter un Examen</h2>
            <form onSubmit={handleAddExam} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom de l'examen :</label>
                <input
                  type="text"
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Date :</label>
                <input
                  type="date"
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Type :</label>
                <select
                  value={newExamType}
                  onChange={(e) => setNewExamType(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="">Sélectionnez</option>
                  <option value="BAC">BAC</option>
                  <option value="DEF">DEF</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Sélectionner un fichier PDF :</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.button}>Ajouter</button>
                <button onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 style={styles.subtitle}>Liste des examens</h2>
      <ul style={styles.list}>
        {exams.map((exam) => (
          <li key={exam.id} style={styles.listItem}>
            {exam.name} - {exam.date} ({exam.type})
          </li>
        ))}
      </ul>
    </div>
  );
}

// ✅ Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    color: "#333",
  },
  addButton: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "15px",
  },
  subtitle: {
    marginTop: "20px",
    color: "#555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  select: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    flex: 1,
    marginRight: "5px",
  },
  cancelButton: {
    padding: "10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    flex: 1,
    marginLeft: "5px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    backgroundColor: "white",
    padding: "10px",
    margin: "5px 0",
    borderRadius: "5px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    width: "400px",
    textAlign: "center",
  },
};

