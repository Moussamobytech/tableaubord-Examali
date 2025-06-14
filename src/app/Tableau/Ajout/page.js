// "use client";

// import { useState, useRef } from "react";
// import { DocumentArrowUpIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

// export default function AddSubject() {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     date: "",
//     year: "",
//   });
//   const [file, setFile] = useState(null);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files?.[0] || null;
//     if (selectedFile) {
//       if (selectedFile.size > 5 * 1024 * 1024) {
//         setError("Le fichier ne doit pas dépasser 5 Mo.");
//         return;
//       }
//       const allowedTypes = ["application/pdf"];
//       if (!allowedTypes.includes(selectedFile.type)) {
//         setError("Seuls les fichiers PDF sont acceptés.");
//         return;
//       }
//     }
//     setFile(selectedFile);
//     setError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setSuccess(null);

//     if (!formData.name || !formData.date || !formData.year) {
//       setError("Le nom de la matière, la date et l'année sont requis.");
//       return;
//     }

//     const submissionData = new FormData();
//     submissionData.append("name", formData.name);
//     submissionData.append("description", formData.description || "");
//     submissionData.append("date", formData.date);
//     submissionData.append("year", formData.year);
//     if (file) submissionData.append("file", file);

//     try {
//       const response = await fetch("/api/sujet", {
//         method: "POST",
//         body: submissionData,
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || "Erreur lors de l’ajout du sujet.");

//       setSuccess("Sujet ajouté avec succès !");
//       setFormData({ name: "", description: "", date: "", year: "" });
//       setFile(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     } catch (err) {
//       setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-red-900 inline-block">
//           Ajouter un sujet d'examen
//         </h1>

//         <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
//           <form onSubmit={handleSubmit} className="space-y-8">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-3">
//                 Nom de la matière
//               </label>
//               <input
//                 type="text"
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="mt-1 block w-full px-4 py-2.5 rounded-xl border-gray-300 shadow-sm focus:border-red-900 focus:ring-2 focus:ring-red-900/50 transition duration-200 sm:text-base"
//                 placeholder="Ex. Mathématiques"
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-3">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={5}
//                 className="mt-1 block w-full px-4 py-2.5 rounded-xl border-gray-300 shadow-sm focus:border-red-900 focus:ring-2 focus:ring-red-900/50 transition duration-200 sm:text-base placeholder-gray-400 placeholder:italic"
//                 placeholder="Détails sur le sujet d'examen..."
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
//               <div>
//                 <label htmlFor="date" className="block text-sm font-medium text-gray-800 mb-3">
//                   Date de l'examen
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-4 py-2.5 rounded-xl border-gray-300 shadow-sm focus:border-red-900 focus:ring-2 focus:ring-red-900/50 transition duration-200 sm:text-base"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="year" className="block text-sm font-medium text-gray-800 mb-3">
//                   Année de l'examen
//                 </label>
//                 <input
//                   type="number"
//                   id="year"
//                   name="year"
//                   value={formData.year}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-4 py-2.5 rounded-xl border-gray-300 shadow-sm focus:border-red-900 focus:ring-2 focus:ring-red-900/50 transition duration-200 sm:text-base"
//                   placeholder="Ex. 2023"
//                   min="1900"
//                   max={new Date().getFullYear()}
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="file" className="block text-sm font-medium text-gray-800 mb-3">
//                 Télécharger un fichier PDF
//               </label>
//               <div className="mt-1 flex items-center">
//                 <label className="flex items-center gap-2 px-6 py-4 bg-red-900 text-white rounded-xl cursor-pointer hover:bg-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2">
//                   <DocumentArrowUpIcon className="h-6 w-6" />
//                   <span className="text-base">Choisir un fichier</span>
//                   <input
//                     type="file"
//                     id="file"
//                     name="file"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     accept=".pdf"
//                     ref={fileInputRef}
//                   />
//                 </label>
//                 <span className={`ml-4 text-base ${file ? "text-gray-700" : "text-gray-400 italic"}`}>
//                   {file ? file.name : "Aucun fichier sélectionné"}
//                 </span>
//               </div>
//             </div>

//             {error && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
//                 <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
//                 <p className="text-red-600 text-base">{error}</p>
//               </div>
//             )}

//             {success && (
//               <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
//                 <CheckCircleIcon className="h-6 w-6 text-green-600" />
//                 <p className="text-green-600 text-base">{success}</p>
//               </div>
//             )}

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="px-8 py-3.5 bg-red-900 text-white rounded-xl hover:bg-red-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-900 focus:ring-offset-2 w-full md:w-auto text-base font-medium"
//               >
//                 Ajouter le sujet
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useRef } from "react";
import { DocumentArrowUpIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function AddSubject() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    year: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const userId = "1"; // Replace with auth userId
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Le fichier ne doit pas dépasser 5 Mo.");
        return;
      }
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Seuls les fichiers PDF sont acceptés.");
        return;
      }
    }
    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.date || !formData.year) {
      setError("Le nom de la matière, la date et l'année sont requis.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description || "");
    submissionData.append("date", formData.date);
    submissionData.append("year", formData.year);
    submissionData.append("userId", userId);
    if (file) submissionData.append("file", file);

    try {
      const response = await fetch("/api/sujet", {
        method: "POST",
        body: submissionData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erreur lors de l’ajout du sujet.");

      setSuccess("Sujet ajouté avec succès !");
      setFormData({ name: "", description: "", date: "", year: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err.message || "Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-red-900 inline-block">
          Ajouter un sujet d'examen
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-3">
                Nom de la matière
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2.5 rounded-xl border-gray-300 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Ex. Mathématiques"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-3">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="mt-1 block w-full px-4 py-2.5 rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-600 placeholder-gray-400"
                placeholder="Détails sur le sujet d'examen..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-800 mb-3">
                  Date de l'examen
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2.5 rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-600"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-800 mb-3">
                  Année de l'examen
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2.5 rounded-xl border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-600"
                  placeholder="2025"
                  min="1900"
                  max="2025"
                />
              </div>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-800 mb-3">
                Télécharger un fichier PDF
              </label>
              <div className="mt-1 flex items-center">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <DocumentArrowUpIcon className="h-5 w-5" />
                  <span>Choisir un fichier</span>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf"
                    ref={fileInputRef}
                  />
                </label>
                <span className="ml-4 text-sm text-gray-600">{file ? file.name : 'Aucun fichier sélectionné'}</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-600 rounded-lg flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-blue-50 border border-blue-500 rounded-lg flex items-center gap-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <p className="text-blue-600 text-sm">{success}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ajouter le Sujet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}