import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { componentSourceRegistry, type ComponentSourceFile } from "@/lib/componentSourceRegistry";

export const runtime = "nodejs";

function resolveWorkspaceFile(filePathSegments: ComponentSourceFile) {
  const root = process.cwd();
  const relativeFilePath = path.join(...filePathSegments);
  const absolutePath = path.resolve(root, relativeFilePath);

  if (!absolutePath.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Source path escapes workspace: ${relativeFilePath}`);
  }

  return absolutePath;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("id");

  if (!sourceId || !(sourceId in componentSourceRegistry)) {
    return NextResponse.json({ error: "Unknown component source." }, { status: 404 });
  }

  const sourceFiles = componentSourceRegistry[sourceId as keyof typeof componentSourceRegistry];
  const sourceBlocks = await Promise.all(
    sourceFiles.map(async (filePathSegments) => {
      const filePath = filePathSegments.join("/");
      const source = await readFile(resolveWorkspaceFile(filePathSegments), "utf8");
      return `// ${filePath}\n${source.trimEnd()}`;
    }),
  );

  return new Response(sourceBlocks.join("\n\n"), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
