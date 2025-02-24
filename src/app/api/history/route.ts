import { prisma } from "@/prisma"
import { NextResponse } from "next/server"

// Simulação de um banco de dados
const history = [
  {
    id: "1",
    fileName: "dados1.csv",
    date: "2023-05-15T10:30:00Z",
    status: "success",
  },
  {
    id: "2",
    fileName: "dados2.json",
    date: "2023-05-16T14:45:00Z",
    status: "error",
    errorMessage: "Formato inválido",
  },
]

export async function GET() {
  const files = await prisma.file.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      logs: true,
    },
  })

  return NextResponse.json(files)
}

export async function POST(request: Request) {
  const data = await request.json()
  const newItem = {
    id: Date.now().toString(),
    ...data,
  }
  history.push(newItem)
  return NextResponse.json(newItem)
}

