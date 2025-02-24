'use client';

import { File, LogFile, Status } from '@prisma/client';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import HistoryModal from './HistoryModal';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export type HistoryType = File & {
  logs: LogFile[];
};

export default function HistorySection({
  refetch,
}: {
  refetch: (fn: () => void) => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [selectedFile, setSelectedFile] = useState<HistoryType | undefined>(
    undefined
  );

  useEffect(() => {
    fetchHistory();
    refetch(fetchHistory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoaded(true);
      const response = await fetch('/api/history');

      setIsLoaded(false);
      if (response.ok) {
        const data: Array<HistoryType> = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };

  function GetDate(input: Date) {
    const date = new Date(input);

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Data inválida!');
    }

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  }

  function ShowBadge(status: Status) {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant={'success'}>Sucesso</Badge>;
      case 'ERROR':
        return <Badge variant={'destructive'}>Erro</Badge>;
      case 'PENDING':
        return <Badge variant={'secondary'}>Pendente</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant={'warning'}>Processando</Badge>;
    }
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="inline-flex justify-between w-full">
          <h2 className="text-2xl font-semibold mb-4">Histórico de Uploads</h2>
          <Button
            size={'sm'}
            variant={'outline'}
            onClick={fetchHistory}
            disabled={isLoaded}
          >
            {isLoaded && <Loader2 className="animate-spin" />}
            atualizar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arquivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ultima atualização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Histórico
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {GetDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {GetDate(item.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ShowBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center items-center">
                    <div
                      className="text-gray-500 p-2 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-300 hover:text-gray-600"
                      onClick={() => setSelectedFile(item)}
                    >
                      <Search size={16} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <HistoryModal
        file={selectedFile}
        onClosed={function (): void {
          setSelectedFile(undefined);
        }}
      />
    </>
  );
}
