import UploadSection from '@/components/UploadSection';
import HistorySection from '@/components/HistorySection';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Upload de Arquivos e Histórico
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <UploadSection />
        <HistorySection />
      </div>
    </main>
  );
}
