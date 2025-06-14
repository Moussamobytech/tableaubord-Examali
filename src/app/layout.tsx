
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from './components/Sidebar';
import Header from './components/Header'; // Corrected path

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Added weights for flexibility
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EXAMALI - Gestion des Examens',
  description: 'Plateforme de gestion des sujets DEF et BACC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-20 md:ml-64">
            <Header />
            <main className="p-4 bg-gray-50 min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}


// import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'
// import './globals.css'
// import Sidebar from './components/Sidebar'
// import Header from '/components/Header'

// // Configuration de la police Inter
// const inter = Inter({ 
//   subsets: ['latin'],
//   variable: '--font-inter',
// })

// export const metadata: Metadata = {
//   title: 'EXAMALI - Gestion des Examens',
//   description: 'Plateforme de gestion des sujets DEF et BACC',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="fr" className={inter.variable}>
//       <body className="font-sans">
//         <div className="flex min-h-screen">
//           <Sidebar />
          
//           <div className="flex-1 ml-20 md:ml-64">
//             <Header />
//             <main className="p-4 bg-gray-50 min-h-screen">
//               {children}
//             </main>
//           </div>
//         </div>
//       </body>
//     </html>
//   )
// }