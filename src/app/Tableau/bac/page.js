"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ExclamationTriangleIcon, PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function BacDashboard() {
  const [scores, setScores] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: "", date: "", year: "", description: "", file: null });
  const fileInputRef = useRef(null);
  const userId = "1"; // Replace with auth userId

  useEffect(() => {
    fetchScores();
    fetchSubjects();
  }, []);

  const fetchScores = async () => {
    try {
      const response = await fetch(`/api/scores?userId=${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors du chargement des scores.");
      }
      const data = await response.json();
      console.log("Scores data:", data);
      if (!Array.isArray(data)) throw new Error("Les données des scores ne sont pas valides.");
      setScores(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch scores error:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/sujet");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors du chargement des sujets.");
      }
      const data = await response.json();
      console.log("Subjects data:", data);
      if (!Array.isArray(data)) throw new Error("Les données des sujets ne sont pas valides.");
      setSubjects(data.filter(subject => subject && subject.id));
    } catch (err) {
      setError(err.message);
      console.error("Fetch subjects error:", err);
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || "",
      date: subject.date || "",
      year: subject.year ? String(subject.year) : "",
      description: subject.description || "",
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous supprimer ce sujet et ses scores associés ?")) return;
    try {
      const response = await fetch(`/api/sujet?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression.");
      }
      setSubjects(subjects.filter((subject) => subject.id !== id));
      await fetchScores(); // Refresh scores after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      submissionData.append("id", editingSubject.id);
      submissionData.append("name", formData.name);
      submissionData.append("description", formData.description);
      submissionData.append("date", formData.date);
      submissionData.append("year", formData.year);
      if (formData.file) submissionData.append("file", formData.file);

      const response = await fetch("/api/sujet", {
        method: "PUT",
        body: submissionData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la modification.");
      }
      const updatedSubject = await response.json();

      setSubjects(
        subjects.map((subject) => (subject.id === editingSubject.id ? updatedSubject : subject))
      );
      setIsModalOpen(false);
      setFormData({ name: "", date: "", year: "", description: "", file: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchScores(); // Refresh scores after update
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      const submissionData = new FormData();
      submissionData.append("name", formData.name);
      submissionData.append("description", formData.description);
      submissionData.append("date", formData.date);
      submissionData.append("year", formData.year);
      submissionData.append("userId", userId);
      if (formData.file) submissionData.append("file", formData.file);

      const response = await fetch("/api/sujet", {
        method: "POST",
        body: submissionData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l’ajout du sujet.");
      }
      const newSubject = await response.json();
      setSubjects([...subjects, newSubject]);
      setIsAddModalOpen(false);
      setFormData({ name: "", date: "", year: "", description: "", file: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchScores(); // Refresh scores after adding subject
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] || null }));
  };

  const averageScore = scores.length > 0
    ? (scores.reduce((sum, { score }) => sum + (parseFloat(score) || 0), 0) / scores.length).toFixed(2)
    : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores.map(({ score }) => parseFloat(score) || 0)) : 0;
  const attempts = scores.length;

  const filteredScores = selectedSubject === "all"
    ? scores
    : scores.filter(({ name }) => name.trim().toLowerCase() === selectedSubject.trim().toLowerCase());

  const chartData = filteredScores
    .reduce((acc, { date, score, name }) => {
      const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_");
      const existing = acc.find((d) => d.date === date);
      if (existing) {
        existing[sanitizedName] = parseFloat(score) || 0;
      } else {
        acc.push({ date, [sanitizedName]: parseFloat(score) || 0 });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log("Chart data:", chartData);
  console.log("Filtered scores:", filteredScores);
  console.log("Unique subjects:", [...new Set(scores.map(({ name }) => name))]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-red-900 inline-block">
          Tableau de Bord BACC
        </h1>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center mb-6 gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            <p className="text-red-600 text-base">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => {
              setFormData({ name: "", date: "", year: "", description: "", file: null });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 inline mr-1" /> Ajouter un Sujet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Score Moyen</h2>
            <p className="text-2xl font-bold text-red-900">{averageScore}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Meilleur Score</h2>
            <p className="text-2xl font-bold text-red-900">{highestScore}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Examens Tentés</h2>
            <p className="text-2xl font-bold text-red-900">{attempts}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Courbe de Progression</h2>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:border-red-900 focus:ring-2 focus:ring-red-900"
            >
              <option value="all">Toutes les matières</option>
              {[...new Set(scores.map(({ name }) => name))].map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          {chartData.length > 0 ? (
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#666"
                    label={{ value: "Score", angle: -90, position: "insideLeft", fill: "#666" }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0" }}
                    labelStyle={{ color: "#333" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  {(selectedSubject === "all" ? [...new Set(scores.map(({ name }) => name))] : [selectedSubject]).map(
                    (subject, index) => (
                      <Line
                        key={subject}
                        type="monotone"
                        dataKey={subject.replace(/[^a-zA-Z0-9]/g, "_")}
                        stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c4b4"][index % 5]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                        name={subject}
                        connectNulls={false}
                      />
                    )
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-600 text-center">Aucun score disponible pour cette sélection.</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Scores Récents</h2>
          {scores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Matière</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scores.slice(0, 5).map(({ scoreId, name, score, date }, index) => (
                    <tr key={scoreId || `score-${index}-${name}-${date}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center">Aucun score récent.</p>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sujets Récents</h2>
          {subjects.length > 0 ? (
            <div className="space-y-4">
              {subjects.map(({ id, name, date, year, filePath }) => (
                <div
                  key={id}
                  className="flex justify-between items-center border-b border-gray-200 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-sm text-gray-600">{date} - {year}</p>
                  </div>
                  <div className="flex gap-2">
                    {filePath && (
                      <Link
                        href={filePath}
                        target="_blank"
                        className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                      >
                        Voir le PDF
                      </Link>
                    )}
                    <button
                      onClick={() => handleEdit({ id, name, date, year, description: "", filePath })}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5 inline mr-1" /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5 inline mr-1" /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">Aucun sujet récent.</p>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Modifier le Sujet</h2>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Année</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nouveau PDF (optionnel)</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500"
                    accept=".pdf"
                    ref={fileInputRef}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un Sujet</h2>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Année</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PDF (optionnel)</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500"
                    accept=".pdf"
                    ref={fileInputRef}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { ExclamationTriangleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
// import Link from "next/link";

// export default function BacDashboard() {
//   const [scores, setScores] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [error, setError] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState("all");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSubject, setEditingSubject] = useState(null);
//   const [formData, setFormData] = useState({ name: "", date: "", year: "", description: "", file: null });
//   const fileInputRef = useRef(null);
//   const userId = "1"; // Replace with auth userId

//   useEffect(() => {
//     fetchScores();
//     fetchSubjects();
//   }, []);

//   const fetchScores = async () => {
//     try {
//       const response = await fetch(`/api/scores?userId=${userId}`);
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erreur lors du chargement des scores.");
//       }
//       const data = await response.json();
//       if (!Array.isArray(data)) throw new Error("Les données des scores ne sont pas valides.");
//       setScores(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const fetchSubjects = async () => {
//     try {
//       const response = await fetch("/api/sujet");
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erreur lors du chargement des sujets.");
//       }
//       const data = await response.json();
//       if (!Array.isArray(data)) throw new Error("Les données des sujets ne sont pas valides.");
//       console.log("Subjects:", data); // Debug
//       setSubjects(data.filter(subject => subject && subject.id));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleEdit = (subject) => {
//     setEditingSubject(subject);
//     setFormData({
//       name: subject.name || "",
//       date: subject.date || "",
//       year: subject.year ? String(subject.year) : "",
//       description: subject.description || "",
//       file: null,
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Voulez-vous supprimer ce sujet et ses scores associés ?")) return;
//     try {
//       const response = await fetch(`/api/sujet?id=${id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erreur lors de la suppression.");
//       }
//       setSubjects(subjects.filter((subject) => subject.id !== id));
//       await fetchScores();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleModalSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const submissionData = new FormData();
//       submissionData.append("id", editingSubject.id);
//       submissionData.append("name", formData.name);
//       submissionData.append("description", formData.description);
//       submissionData.append("date", formData.date);
//       submissionData.append("year", formData.year);
//       if (formData.file) submissionData.append("file", formData.file);

//       const response = await fetch("/api/sujet", {
//         method: "PUT",
//         body: submissionData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erreur lors de la modification.");
//       }

//       // Get updated subject from response
//       const updatedSubject = await response.json();
//       console.log("Updated Subject:", updatedSubject); // Debug

//       setSubjects(
//         subjects.map((subject) => (subject.id === editingSubject.id ? updatedSubject : subject))
//       );
//       setIsModalOpen(false);
//       setFormData({ name: "", date: "", year: "", description: "", file: null });
//       if (fileInputRef.current) fileInputRef.current.value = "";
//       await fetchSubjects(); // Refresh subjects
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({ ...prev, file: e.target.files[0] || null }));
//   };

//   // Summary stats
//   const averageScore = scores.length > 0
//     ? (scores.reduce((sum, { score }) => sum + score, 0) / scores.length).toFixed(2)
//     : 0;
//   const highestScore = scores.length > 0 ? Math.max(...scores.map(({ score }) => score)) : 0;
//   const attempts = scores.length;

//   // Filter scores by selected subject
//   const filteredScores = selectedSubject === "all"
//     ? scores
//     : scores.filter(({ name }) => name === selectedSubject);

//   // Prepare chart data
//   const chartData = filteredScores.reduce((acc, { date, score, name }) => {
//     const formattedDate = date ? new Date(date).toISOString().split('T')[0] : null;
//     if (!formattedDate || !name || score == null) return acc;
//     const existing = acc.find((d) => d.date === formattedDate);
//     if (existing) {
//       existing[name] = score;
//     } else {
//       acc.push({ date: formattedDate, [name]: score });
//     }
//     return acc;
//   }, []);

//   const uniqueSubjects = [...new Set(scores.map(({ name }) => name).filter(Boolean))];

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-red-900 inline-block">
//           Tableau de Bord BACC
//         </h1>

//         {error && (
//           <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center mb-6 gap-3">
//             <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
//             <p className="text-red-600 text-base">{error}</p>
//           </div>
//         )}

//         {/* Summary Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800">Score Moyen</h2>
//             <p className="text-2xl font-bold text-red-900">{averageScore}</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800">Meilleur Score</h2>
//             <p className="text-2xl font-bold text-red-900">{highestScore}</p>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
//             <h2 className="text-lg font-semibold text-gray-800">Examens Tentés</h2>
//             <p className="text-2xl font-bold text-red-900">{attempts}</p>
//           </div>
//         </div>

//         {/* Chart Section */}
//         <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800">Courbe de Progression</h2>
//             <select
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-800 focus:border-red-900 focus:ring-2 focus:ring-red-900"
//             >
//               <option value="all">Toutes les matières</option>
//               {uniqueSubjects.map((subject) => (
//                 <option key={subject} value={subject}>{subject}</option>
//               ))}
//             </select>
//           </div>
//           {chartData.length > 0 ? (
//             <div style={{ height: 400 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={chartData}
//                   margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                   <XAxis dataKey="date" stroke="#666" />
//                   <YAxis
//                     domain={[0, 100]}
//                     stroke="#666"
//                     label={{ value: "Score", angle: -90, position: "insideLeft", fill: "#666" }}
//                   />
//                   <Tooltip
//                     contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0" }}
//                     labelStyle={{ color: "#333" }}
//                   />
//                   <Legend wrapperStyle={{ paddingTop: "20px" }} />
//                   {(selectedSubject === "all" ? uniqueSubjects : [selectedSubject]).map((subject, index) => (
//                     <Line
//                       key={subject}
//                       type="monotone"
//                       dataKey={subject}
//                       stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c4b4"][index % 5]}
//                       strokeWidth={2}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 8 }}
//                       name={subject}
//                     />
//                   ))}
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           ) : (
//             <p className="text-gray-600 text-center">Aucun score disponible pour cette sélection.</p>
//           )}
//         </div>

//         {/* Recent Scores Table */}
//         <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Scores Récents</h2>
//           {scores.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Matière</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Score</th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {scores.slice(0, 5).map(({ scoreId, name, score, date }) => (
//                     <tr key={scoreId || `${name}-${date}-${score}`}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{date}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-600 text-center">Aucun score récent.</p>
//           )}
//         </div>

//         {/* Recent Subjects */}
//         <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800 mb-6">Sujets Récents</h2>
//           {subjects.length > 0 ? (
//             <div className="space-y-4">
//               {subjects.map(({ id, name, date, year, filePath }) => (
//                 <div
//                   key={id || `${name}-${date}-${year}`}
//                   className="flex justify-between items-center border-b border-gray-200 pb-4"
//                 >
//                   <div>
//                     <p className="text-sm font-medium text-gray-900">{name}</p>
//                     <p className="text-sm text-gray-600">{date} - {year}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     {filePath ? (
//                       <Link
//                         href={filePath}
//                         target="_blank"
//                         className="px-4 py-2 bg-red-900 text-white rounded-xl hover:bg-red-800 transition-colors"
//                       >
//                         Voir le PDF
//                       </Link>
//                     ) : (
//                       <span className="px-4 py-2 text-gray-500">Aucun PDF</span>
//                     )}
//                     <button
//                       onClick={() => handleEdit({ id, name, date, year, description: "", filePath })}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
//                     >
//                       <PencilIcon className="h-5 w-5 inline mr-1" /> Modifier
//                     </button>
//                     <button
//                       onClick={() => handleDelete(id)}
//                       className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
//                     >
//                       <TrashIcon className="h-5 w-5 inline mr-1" /> Supprimer
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-600 text-center">Aucun sujet récent.</p>
//           )}
//         </div>

//         {/* Edit Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
//               <h2 className="text-xl font-semibold text-gray-800 mb-6">Modifier le Sujet</h2>
//               <form onSubmit={handleModalSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Nom</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-900 focus:border-red-900"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date</label>
//                   <input
//                     type="date"
//                     name="date"
//                     value={formData.date}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-900 focus:border-red-900"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Année</label>
//                   <input
//                     type="number"
//                     name="year"
//                     value={formData.year}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-900 focus:border-red-900"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Description</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-900 focus:border-red-900"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Nouveau PDF (optionnel)</label>
//                   <input
//                     type="file"
//                     name="file"
//                     onChange={handleFileChange}
//                     className="mt-1 block w-full"
//                     accept=".pdf"
//                     ref={fileInputRef}
//                   />
//                 </div>
//                 <div className="flex justify-end gap-4">
//                   <button
//                     type="button"
//                     onClick={() => setIsModalOpen(false)}
//                     className="px-4 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-red-900 text-white rounded-xl hover:bg-red-800"
//                   >
//                     Enregistrer
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }