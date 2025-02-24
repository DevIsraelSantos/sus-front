import { prisma } from '@/prisma';
import { LogType } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const files = await prisma.file.findMany({
    orderBy: {
      id: 'desc',
    },
    include: {
      logs: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return NextResponse.json(files);
}

export async function POST(request: Request) {
  const data: {
    fileId: string;
    message: string;
    type: LogType;
  } = await request.json();
  // INIT = Iniciando o processamento
  // END = Processamento finalizado com sucesso

  const id = Number(data.fileId);

  if (data.message === 'INIT') {
    await prisma.file.update({
      where: {
        id,
      },
      data: {
        status: 'IN_PROGRESS',
      },
    });

    data.message = 'Iniciando o processamento';
  }

  if (data.message === 'END') {
    await prisma.file.update({
      where: {
        id,
      },
      data: {
        status: 'SUCCESS',
      },
    });

    data.message = 'Processamento finalizado com sucesso';
  }

  const log = await prisma.logFile.create({
    data: {
      fileId: id,
      message: data.message,
      type: data.type,
    },
  });

  return NextResponse.json(log);
}
