import { DBFFile } from 'dbffile';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { Logger } from '../logger.class';
import { ValidateColumnNames } from './columns';
import { prisma } from '@/prisma';

// 📌 Configuração para permitir uploads grandes
export const config = {
  api: {
    bodyParser: false, // Importante para FormData funcionar no App Router
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    const fileinit = await prisma.file.create({
      data: {
        name: file.name,
      },
    });

    const logger = new Logger(fileinit.id);
    await logger.log(`Inicio do processamento do arquivo ${file.name}`);

    // Inicia o processo de upload
    const tempDir = path.join(process.cwd(), 'public', 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    const tempFilePath = path.join(tempDir, fileinit.id.toString() + '.dbf');

    // Lê o arquivo em memória e salva no disco
    await logger.log('Salvando o arquivo na pasta temporária');
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, buffer);
    await prisma.file.update({
      where: {
        id: fileinit.id,
      },
      data: {
        currentPath: tempFilePath,
      },
    });
    await logger.log('Arquivo salvo com sucesso');

    // Valida colunas do arquivo
    await logger.log('Inicio da validação das colunas do arquivo');
    const dbf = await DBFFile.open(tempFilePath);
    await logger.log('Arquivo DBF aberto com sucesso');
    const fieldsInfo = dbf.fields.map((field) => field.name.toLowerCase());
    const fileType = await ValidateColumnNames(fieldsInfo);
    await logger.log(
      `O arquivo possui ${fieldsInfo.length} colunas. considerado ${fileType}`
    );

    if (fileType === 'ERRO') {
      await logger.log('Removendo arquivo temporário');
      await fs.rm(tempFilePath);
      await prisma.file.update({
        where: {
          id: fileinit.id,
        },
        data: {
          currentPath: null,
          status: 'ERROR',
        },
      });
      await logger.warn('Arquivo removido com sucesso');
      await logger.error('Tipo de arquivo não reconhecido');
      return NextResponse.json(
        { error: 'Tipo de arquivo não reconhecido, verifica as colunas' },
        { status: 400 }
      );
    } else {
      await prisma.file.update({
        where: {
          id: fileinit.id,
        },
        data: {
          type: fileType,
        },
      });
    }
    await logger.log(`Tipo de arquivo identificado: ${fileType}`);

    // Move o arquivo para a pasta de espera
    await logger.log(`Movendo o arquivo para a pasta de espera`);
    const finalDir = path.join(process.cwd(), 'public', 'files', 'pending');
    await fs.mkdir(finalDir, { recursive: true });

    const finalPath = path.join(finalDir, fileinit.id.toString() + '.dbf');
    await fs.rename(tempFilePath, finalPath);
    await prisma.file.update({
      where: {
        id: fileinit.id,
      },
      data: {
        currentPath: finalPath,
      },
    });
    await logger.log('Arquivo aguardando processamento');

    return NextResponse.json(
      { message: `Arquivo salvo em /public/${finalPath}` },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Erro desconhecido';
    console.log('Erro ao processar o arquivo:', errorMessage);
    return NextResponse.json(
      { error: 'Erro ao processar o arquivo', details: errorMessage },
      { status: 500 }
    );
  }
}
