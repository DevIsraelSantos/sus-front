'use client';

import HistorySection from '@/components/HistorySection';
import { ModeToggle } from '@/components/mode-toggle';
import UploadSection from '@/components/UploadSection';
import { useState } from 'react';

export default function Home() {
  const [refreshHistory, setRefreshHistory] = useState<(() => void) | null>(
    null
  );

  return (
    <main className="container bg-background mx-auto px-4 py-8 flex flex-col gap-8">
      <ModeToggle />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center m-auto text-primary">
          Upload e Histórico de arquivos
        </h1>
      </div>
      <UploadSection refreshHistory={refreshHistory} />
      <HistorySection refetch={(fn) => setRefreshHistory(() => fn)} />
    </main>
  );
}
