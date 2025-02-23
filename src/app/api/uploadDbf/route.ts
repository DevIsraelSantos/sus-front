import { DBFFile } from 'dbffile';
import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { Logger } from '../logger.class';
import { ValidateColumnNames } from './columns';

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
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const logger = new Logger(file.name);
    logger.log('Iniciando processamento do arquivo');

    logger.log('Criando caminho temporário para salvar o arquivo');
    const tempDir = path.join(process.cwd(), 'public', 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    logger.log(`Caminho temporário criado com sucesso: ${tempDir}`);

    const tempFilePath = path.join(tempDir, file.name);
    logger.log(`Caminho do arquivo temporário: ${tempFilePath}`);
    const buffer = Buffer.from(await file.arrayBuffer());

    logger.log('Escrevendo o arquivo no disco');
    await fs.writeFile(tempFilePath, buffer);
    logger.log('Arquivo salvo com sucesso');

    logger.log('Abrindo o arquivo DBF');
    const dbf = await DBFFile.open(tempFilePath);
    logger.log('Arquivo DBF aberto com sucesso');
    const fieldsInfo = dbf.fields.map((field) => field.name.toLowerCase());
    const fileType = await ValidateColumnNames(fieldsInfo);
    if(fileType === 'ERRO') {
      logger.log('Tipo de arquivo não reconhecido');
      logger.log('Removendo arquivo temporário');
      await fs.rm(tempFilePath);
      logger.log('Arquivo removido com sucesso');
      return NextResponse.json({ error: 'Tipo de arquivo não reconhecido, verifica as colunas' }, { status: 400 });
    }
    logger.log(`Tipo de arquivo identificado: ${fileType}`);

    const destinationFolder = 'awaiting_upload';
    logger.log(`Pasta de destino: ${destinationFolder}`);

    const finalDir = path.join(process.cwd(), 'public', destinationFolder);
    await fs.mkdir(finalDir, { recursive: true });

    const finalPath = path.join(finalDir, file.name);
    logger.log(`Movendo o arquivo para ${finalPath}`);
    await fs.rename(tempFilePath, finalPath);
    logger.log('Arquivo movido com sucesso');

    return NextResponse.json(
      { message: `Arquivo salvo em /public/${finalPath}` },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.log('Erro ao processar o arquivo:', errorMessage);
    return NextResponse.json({ error: 'Erro ao processar o arquivo', details: errorMessage }, { status: 500 });
  }
}
