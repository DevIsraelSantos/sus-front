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
    fileId: number;
    message: string;
    type: LogType;
  } = await request.json();

  const log = await prisma.logFile.create({
    data: {
      fileId: data.fileId,
      message: data.message,
      type: data.type,
    },
  });

  return NextResponse.json(log);
}
