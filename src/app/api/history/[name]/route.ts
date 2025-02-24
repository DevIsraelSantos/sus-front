import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const name = (await params).name;
  const file = await prisma.file.findUnique({
    where: { name },
    include: { logs: true },
  });

  return NextResponse.json({ file });
}
