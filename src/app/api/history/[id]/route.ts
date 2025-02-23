import { NextResponse } from "next/server"

// Simulação de um banco de dados
let history = [
  {
    id: "1",
    fileName: "dados1.dbf",
    date: "2023-05-15T10:30:00Z",
    status: "success",
  },
  {
    id: "2",
    fileName: "dados2.dbf",
    date: "2023-05-16T14:45:00Z",
    status: "error",
    errorMessage: "Formato inválido",
  },
]

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  history = history.filter((item) => item.id !== id)
  return NextResponse.json({ success: true })
}

