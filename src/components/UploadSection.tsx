'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

export default function UploadSection({
  refreshHistory,
}: {
  refreshHistory: (() => void) | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function IsValidName(name: string): Promise<boolean> {
    const response = await fetch(`api/history/${name}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.file) {
        alert('Arquivo já existe');
        return false;
      }
    }

    return true;
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      IsValidName(acceptedFiles[0].name).then((isValid) => {
        if (isValid) {
          setFile(acceptedFiles[0]);
          setIsModalOpen(true);
        }
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/dbf': ['.dbf'],
    },
    maxFiles: 1,
  });

  const handleConfirmUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/uploadDbf', {
        method: 'POST',
        body: formData,
      });

      if (refreshHistory) {
        refreshHistory();
      }

      if (response.ok) {
        console.log('Upload realizado com sucesso');
      } else {
        console.error('Erro no upload');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    }

    setIsModalOpen(false);
    setFile(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upload de Arquivo DBF</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Arraste e solte um arquivo .DBF aqui, ou clique para selecionar
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Apenas arquivos .dbf são aceitos
        </p>
      </div>
      {isModalOpen && file && (
        <ConfirmationModal
          file={file}
          onConfirm={handleConfirmUpload}
          onCancel={() => {
            setIsModalOpen(false);
            setFile(null);
          }}
        />
      )}
    </div>
  );
}
