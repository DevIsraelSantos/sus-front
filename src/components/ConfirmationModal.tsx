import { Dialog, Transition } from '@headlessui/react';
import { Loader2, X } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Button } from './ui/button';

interface ConfirmationModalProps {
  file: File;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  file,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onCancel}>
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
                  Confirmar Upload
                  <button
                    onClick={onCancel}
                    data-is-loading={isLoaded}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none data-is-loading:cursor-not-allowed"
                    disabled={isLoaded}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Você está prestes a fazer upload do seguinte arquivo:
                  </p>
                  <ul className="mt-2 space-y-1">
                    <li className="text-sm font-medium">Nome: {file.name}</li>
                    <li className="text-sm">Tipo: {file.type}</li>
                    <li className="text-sm">
                      Tamanho: {(file.size / 1024).toFixed(2)} KB
                    </li>
                  </ul>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      setIsLoaded(true);
                      onConfirm();
                    }}
                    disabled={isLoaded}
                  >
                    {isLoaded && <Loader2 className="animate-spin" />}
                    Confirmar
                  </Button>
                  <button
                    type="button"
                    data-is-loading={isLoaded}
                    className="data-is-loading:cursor-not-allowed inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={onCancel}
                    disabled={isLoaded}
                  >
                    Cancelar
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
