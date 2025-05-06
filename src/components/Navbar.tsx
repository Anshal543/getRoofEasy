"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchSearchSuggestions } from "@/lib/action";
import { Lead } from "@/lib/types";
import { useSearchInfo } from "@/store/useSearch";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Header from "./Header";
import { ModeToggle } from "./ModeToggle";
import FullscreenToggle from "./screen-toggle/FullscreenToggle";

const Navbar = ({ userId }: { userId: number }) => {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<Lead[]>([]);
  const { setSearchQuery } = useSearchInfo();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function highlightMatch(text: string, query: string) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <span>
        {text.slice(0, index)}
        <span className="font-semibold">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </span>
    );
  }

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchInput.trim()) {
        const results = await fetchSearchSuggestions(searchInput, userId);
        setSuggestions(results.results);
        if (results.results.length > 0) {
          setIsPopoverOpen(true);
        }
      } else {
        setSuggestions([]);
        setIsPopoverOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (searchInput.trim() && suggestions.length > 0) {
      setIsPopoverOpen(true);
    }
  };

  const handleSuggestionClick = (lead: Lead) => {
    setSearchInput(lead.first_name);
    setIsPopoverOpen(false);
    inputRef.current?.focus();
  };

  const handleViewAll = () => {
    setIsPopoverOpen(false);
    router.push(`/leads?query=${encodeURIComponent(searchInput)}`);
  };

  return (
    <Header>
      <div className="relative ml-10 hidden lg:block">
        <Popover
          open={isPopoverOpen}
          onOpenChange={(open) => {
            if (!open || (searchInput.trim() && suggestions.length > 0)) {
              setIsPopoverOpen(open);
            }
          }}
        >
          <PopoverTrigger asChild>
            <div className="relative">
              <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 transform dark:hover:text-[var(--blue-600)]">
                <CiSearch className="h-5 w-5 text-[var(--gray-500)] dark:text-[var(--gray-400)]" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                value={searchInput}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                onClick={(e) => e.stopPropagation()}
                className="bg-background dark:bg-background w-64 rounded-md border border-[var(--gray-300)] py-2 pr-3 pl-10 text-[var(--gray-900)] focus:outline-none dark:border-[var(--gray-600)] dark:text-[var(--gray-100)]"
              />
            </div>
          </PopoverTrigger>
          {isPopoverOpen && (
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
              align="start"
              onInteractOutside={(e) => {
                if (!inputRef.current?.contains(e.target as Node)) {
                  setIsPopoverOpen(false);
                }
              }}
            >
              <Command>
                <CommandList>
                  {suggestions.length === 0 ? (
                    <CommandEmpty>No results found</CommandEmpty>
                  ) : (
                    <>
                      <CommandGroup heading="Suggestions">
                        {suggestions.map((lead) => (
                          <CommandItem
                            key={lead.id}
                            value={lead.id.toString()}
                            onSelect={() => {
                              router.push(`/leads/${lead.id}`);
                              handleSuggestionClick(lead);
                            }}
                            className="aria-selected:bg-accent aria-selected:text-accent-foreground mb-2 cursor-pointer"
                          >
                            {highlightMatch(
                              `${lead.first_name || ""} ${lead.last_name || ""}`,
                              searchInput,
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      <CommandItem
                        onSelect={handleViewAll}
                        className="text-primary cursor-pointer justify-center"
                      >
                        View all results
                      </CommandItem>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>

      <div className="mr-[30px] ml-auto hidden items-center space-x-4 md:flex">
        <FullscreenToggle />
        <div className="flex cursor-pointer items-center hover:opacity-55">
          <ModeToggle />
        </div>
        <div className="hidden items-center md:flex">
          <UserButton
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}
          />
        </div>
      </div>

      <div className="ml-auto flex items-center space-x-2 md:hidden">
        <FullscreenToggle />

        <div className="flex items-center">
          <ModeToggle />
        </div>
        <div className="flex items-center">
          <UserButton
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
            }}
          />
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
