import UploadSection from '@/components/UploadSection';
import HistorySection from '@/components/HistorySection';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center m-auto">
          Upload e Histórico de arquivos
        </h1>
      </div>
      <UploadSection />
      <HistorySection />
    </main>
  );
}
