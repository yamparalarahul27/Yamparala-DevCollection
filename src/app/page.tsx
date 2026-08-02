import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { ComponentListItem } from "@/components/ComponentCollectionList";
import ComponentCollectionStudio from "@/components/ComponentCollectionStudio";
import {
  componentRegistry,
  type ComponentSourceFile,
} from "@/lib/componentRegistry";

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function getComponentUpdatedAt(sourceFiles: readonly ComponentSourceFile[]) {
  const relativePaths = sourceFiles.map((segments) => path.join(...segments));

  try {
    const lastCommitTimestamp = execFileSync(
      "git",
      ["log", "-1", "--format=%ct", "--", ...relativePaths],
      { cwd: process.cwd(), encoding: "utf8" },
    ).trim();

    if (lastCommitTimestamp) {
      return new Date(Number(lastCommitTimestamp) * 1000);
    }
  } catch {
    // Fall through to mtimes.
  }

  const newestMs = relativePaths.reduce((latest, relativePath) => {
    const absolutePath = path.join(process.cwd(), relativePath);
    if (!existsSync(absolutePath)) {
      return latest;
    }
    return Math.max(latest, statSync(absolutePath).mtimeMs);
  }, 0);

  return new Date(newestMs);
}

const sortedComponents: ComponentListItem[] = componentRegistry
  .map((entry) => {
    const updatedAt = getComponentUpdatedAt(entry.sourceFiles);
    return {
      href: entry.href,
      title: entry.title,
      description: entry.description,
      color: entry.color,
      status: entry.status,
      category: entry.category,
      updatedAtLabel: dateFormatter.format(updatedAt),
      updatedAtMs: updatedAt.getTime(),
    };
  })
  .sort((a, b) => {
    if (b.updatedAtMs !== a.updatedAtMs) {
      return b.updatedAtMs - a.updatedAtMs;
    }
    return a.title.localeCompare(b.title);
  });

const totalCount = sortedComponents.length;
const latestCount = sortedComponents.filter((c) => c.status === "Latest").length;
const categoryCount = new Set(sortedComponents.map((c) => c.category)).size;

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-gray-200/60 px-6 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center text-center">
          <Image
            src="/proteus-logo.svg"
            alt="Proteus logo"
            width={1329}
            height={400}
            className="h-auto w-[160px] sm:w-[200px]"
            priority
          />
          <p className="mt-3 text-sm text-gray-500">
            Component Collection by Yamparala Rahul · Design Engineer
          </p>
        </div>
      </header>

      <main className="px-4 py-6 sm:px-6 sm:py-8">
        <ComponentCollectionStudio
          components={sortedComponents}
          stats={{
            total: totalCount,
            categories: categoryCount,
            latest: latestCount,
          }}
        />
      </main>
    </div>
  );
}
