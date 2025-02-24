import { Dialog, Transition } from '@headlessui/react';
import { LogType } from '@prisma/client';
import { X } from 'lucide-react';
import { Fragment } from 'react';

import { HistoryType } from './HistorySection';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface HistoryModalProps {
  file: HistoryType | undefined;
  onClosed: () => void;
}

export default function HistoryModal({ file, onClosed }: HistoryModalProps) {
  if (!file) return null;

  file.logs.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  function ShowBadge({ status }: { status: LogType }) {
    switch (status) {
      case 'INFO':
        return <Badge variant={'success'}>Sucesso</Badge>;
      case 'ERROR':
        return <Badge variant={'destructive'}>Erro</Badge>;
      case 'WARNING':
        return <Badge variant={'secondary'}>Pendente</Badge>;
    }
  }
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

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClosed}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  Histórico do Arquivo: {file.id}
                  <button
                    onClick={onClosed}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Arquivo {file.type}. Nome: {file.name}
                  </p>

                  <ScrollArea className="space-y-4 my-1 max-h-96 overflow-y-auto">
                    {file.logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex justify-between items-center hover:bg-gray-50 mb-2"
                      >
                        <div className="flex flex-col">
                          <p className="text-base">{log.message}</p>
                          <p className="text-sm">{GetDate(log.createdAt)}</p>
                        </div>
                        <div className="flex items-center w-20 justify-center">
                          <ShowBadge status={log.type} />
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onClosed}
                  >
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
