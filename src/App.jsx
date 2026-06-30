import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LookupForm from './components/LookupForm.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6 w-full">
        <h1 className="text-[2.5rem] md:text-5xl font-light text-neutral-900 tracking-tight">
          Consulta de cliente
        </h1>
        <p className="text-neutral-600 mt-3 text-base md:text-lg max-w-2xl">
          Ingresa el RUC del cliente para obtener su información registrada en el sistema.
        </p>
      </div>

      <div className="flex-1">
        <LookupForm />
      </div>

      <Footer />
    </div>
  );
}
