// import Image from 'next/image';

const Page = () => {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md">
      {/* Partie gauche avec icône et texte */}
      <div className="flex items-center">
        <div className="w-10 h-10 bg-green-700 text-white flex items-center justify-center rounded-full text-lg font-bold">
          A
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold">Anglais</h3>
          <p className="text-gray-600 text-sm">Anglais du DEF 2022</p>
        </div>
      </div>

      {/* Bouton Voir le sujet */}
      <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
        Voir le sujet
      </button>
    </div>
  );
};

export default Page;