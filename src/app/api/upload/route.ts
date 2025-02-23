import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  try {
    // const blob = await put(file.name, file, {
    //   access: "public",
    // })

    console.log("File uploaded:", file.name)

    const blob = {
      url: "https://example.com/" + file.name,
    }

    // Aqui você pode adicionar lógica para salvar informações do upload no banco de dados
    // Por exemplo, chamar uma função para adicionar ao histórico

    return NextResponse.json({ success: true, url: blob.url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

