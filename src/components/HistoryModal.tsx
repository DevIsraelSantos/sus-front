import { Dialog, Transition } from '@headlessui/react';
import { LogType } from '@prisma/client';
import { X } from 'lucide-react';
import { Fragment } from 'react';

import { HistoryType } from './HistorySection';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface HistoryModalProps {
  file: HistoryType | undefined;
  onClosed: () => void;
}

export default function HistoryModal({ file, onClosed }: HistoryModalProps) {
  if (!file) return null;

  function ShowBadge({ status }: { status: LogType }) {
    switch (status) {
      case 'INFO':
        return <Badge variant={'success'}>Sucesso</Badge>;
      case 'ERROR':
        return <Badge variant={'destructive'}>Erro</Badge>;
      case 'WARNING':
        return <Badge variant={'warning'}>Aviso</Badge>;
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-muted/90 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-primary flex justify-between items-center"
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
                  <div className="text-sm text-primary/75 border-b border-gray-200 pb-2 inline-flex items-center w-full justify-start gap-1">
                    <span>{'Arquivo'}</span>
                    <Badge variant={file.type ? 'warning' : 'destructive'}>
                      {file.type ?? 'ERRO'}
                    </Badge>
                    <span>{`Nome: ${file.name}`}</span>
                  </div>

                  <ScrollArea className="space-y-4 my-1 max-h-96 overflow-y-auto">
                    {file.logs.map((log) => (
                      <div
                        key={log.id}
                        className="text-primary/70 flex justify-between items-center hover:bg-background/60 mb-2 p-1"
                      >
                        <div className="flex flex-col">
                          <p className="text-base">{log.message}</p>
                          <p className="text-xs">{GetDate(log.createdAt)}</p>
                        </div>
                        <div className="flex items-center min-w-20 w-20 justify-center">
                          <ShowBadge status={log.type} />
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    type="button"
                    onClick={onClosed}
                    variant={'secondary'}
                  >
                    Fechar
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
