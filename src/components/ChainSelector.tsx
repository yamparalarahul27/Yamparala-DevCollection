"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ChainOption = {
  id: string;
  label: string;
  icon: string;
};

export type ChainSelectorProps = {
  chains: readonly ChainOption[];
  /** Controlled selected chain id. */
  value?: string;
  /** Uncontrolled initial selected chain id. */
  defaultValue?: string;
  onChange?: (chainId: string) => void;
  label?: string;
  showChevron?: boolean;
  className?: string;
};

export const defaultDemoChains: readonly ChainOption[] = [
  { id: "ethereum", label: "Ethereum", icon: "/proteus/header/chain-ethereum.svg" },
  { id: "solana", label: "Solana", icon: "/proteus/header/chain-solana.svg" },
  { id: "bitcoin", label: "Bitcoin", icon: "/proteus/header/chain-bitcoin.svg" },
  { id: "base", label: "Base", icon: "/proteus/header/chain-4.svg" },
  { id: "arbitrum", label: "Arbitrum", icon: "/proteus/header/chain-5.svg" },
  { id: "optimism", label: "Optimism", icon: "/proteus/header/chain-6.svg" },
  { id: "polygon", label: "Polygon", icon: "/proteus/header/chain-7.svg" },
  { id: "avalanche", label: "Avalanche", icon: "/proteus/header/chain-8.svg" },
];

export default function ChainSelector({
  chains,
  value,
  defaultValue,
  onChange,
  label = "Chains:",
  showChevron = true,
  className,
}: ChainSelectorProps) {
  const firstId = chains[0]?.id ?? "";
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? firstId,
  );
  const selectedId = value ?? uncontrolledValue;
  const selectedChain =
    chains.find((chain) => chain.id === selectedId) ?? chains[0] ?? null;

  function selectChain(chainId: string) {
    if (value === undefined) {
      setUncontrolledValue(chainId);
    }
    onChange?.(chainId);
  }

  if (!selectedChain) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex w-full max-w-[610px] items-center gap-3 overflow-x-auto rounded-[100px] bg-[var(--surface)] px-4 py-1 shadow-[var(--proteus-shadow)] hide-scrollbar sm:gap-6",
        className,
      )}
      role="tablist"
      aria-label={label.replace(/:$/, "")}
    >
      <span className="shrink-0 text-[14px] text-[var(--foreground)]">{label}</span>
      <div className="flex flex-1 items-center gap-2 sm:justify-between sm:gap-4">
        {chains.map((chain) => {
          const active = selectedChain.id === chain.id;
          return (
            <button
              aria-selected={active}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-sm p-[6px] transition-colors",
                active
                  ? "border-b-2 border-[var(--accent-purple)]"
                  : "border-b-2 border-transparent hover:bg-black/[0.03]",
              )}
              key={chain.id}
              onClick={() => selectChain(chain.id)}
              role="tab"
              type="button"
            >
              <Image
                alt=""
                aria-hidden="true"
                className="h-5 w-5 shrink-0"
                height={20}
                src={chain.icon}
                width={20}
              />
              {active ? (
                <span className="whitespace-nowrap text-[12px] font-medium text-[var(--foreground)]">
                  {chain.label}
                </span>
              ) : (
                <span className="sr-only">{chain.label}</span>
              )}
            </button>
          );
        })}
      </div>
      {showChevron ? (
        <Image
          alt=""
          aria-hidden="true"
          className="ml-auto hidden h-6 w-6 shrink-0 rotate-180 sm:block"
          height={24}
          src="/proteus/header/chevron-up.svg"
          width={24}
        />
      ) : null}
    </div>
  );
}
