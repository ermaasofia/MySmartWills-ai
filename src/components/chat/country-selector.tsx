'use client';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { COUNTRIES } from '@/lib/constants';
import { Country } from '@/types';

import {
  ChevronDown,
  Check,
} from 'lucide-react';

import { CountryFlag } from '@/components/ui/country-flag';

interface CountrySelectorProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}

export function CountrySelector({
  selectedCountry,
  onSelect,
}: CountrySelectorProps) {
  return (
    <DropdownMenu>
      {/* =========================================
          SELECTED COUNTRY BUTTON
      ========================================= */}

      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="
            h-10
            min-w-[150px]
            justify-between
            gap-2
            rounded-[10px]
            border-[#dedede]
            bg-white
            px-3
            text-[#222222]
            shadow-[0_2px_8px_rgba(0,0,0,0.025)]
            transition-all

            hover:border-[#cccccc]
            hover:bg-[#fafafa]
            hover:text-[#171717]

            focus-visible:border-[#a42025]/40
            focus-visible:ring-2
            focus-visible:ring-[#a42025]/10

            sm:min-w-[190px]
          "
        >
          {/* Selected country */}

          <span className="flex min-w-0 items-center gap-2">
            {/* Flag box */}

            <span
              className="
                flex
                h-7
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[6px]
                border
                border-[#eeeeee]
                bg-[#fafafa]
              "
            >
              <CountryFlag
                code={selectedCountry.code}
                name={selectedCountry.name}
                className="
                  h-4
                  w-6
                  rounded-[2px]
                  object-cover
                "
              />
            </span>

            {/* Country name */}

            <span
              className="
                truncate
                text-[12px]
                font-semibold
                text-[#333333]
              "
            >
              {selectedCountry.name}
            </span>
          </span>

          {/* Dropdown arrow */}

          <ChevronDown
            className="
              h-3.5
              w-3.5
              shrink-0
              text-[#999999]
            "
          />
        </Button>
      </DropdownMenuTrigger>

      {/* =========================================
          DROPDOWN CONTENT
      ========================================= */}

      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="
          max-h-[400px]
          w-[240px]
          overflow-y-auto
          rounded-[12px]
          border
          border-[#e5e5e5]
          bg-white
          p-1.5
          text-[#171717]
          shadow-[0_16px_45px_rgba(0,0,0,0.12)]
        "
      >
        {COUNTRIES.map((country) => {
          const isSelected =
            country.code ===
            selectedCountry.code;

          return (
            <DropdownMenuItem
              key={country.code}
              onClick={() =>
                onSelect(country)
              }
              className={`
                group
                flex
                cursor-pointer
                items-center
                gap-3
                rounded-[8px]
                px-2.5
                py-2.5
                outline-none
                transition-colors

                ${
                  isSelected
                    ? `
                        bg-[#a42025]/[0.06]
                        focus:bg-[#a42025]/[0.08]
                      `
                    : `
                        focus:bg-[#f6f6f6]
                      `
                }
              `}
            >
              {/* =====================================
                  FLAG
              ===================================== */}

              <span
                className="
                  flex
                  h-8
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-[6px]
                  border
                  border-[#eeeeee]
                  bg-[#fafafa]
                "
              >
                <CountryFlag
                  code={country.code}
                  name={country.name}
                  className="
                    h-4
                    w-6
                    rounded-[2px]
                    object-cover
                  "
                />
              </span>

              {/* =====================================
                  COUNTRY INFO
              ===================================== */}

              <div className="min-w-0 flex-1">
                {/* Country name */}

                <span
                  className={`
                    block
                    truncate
                    text-[12px]
                    font-semibold

                    ${
                      isSelected
                        ? 'text-[#a42025]'
                        : 'text-[#333333]'
                    }
                  `}
                >
                  {country.name}
                </span>

                {/* Language */}

                <span
                  className="
                    mt-0.5
                    block
                    truncate
                    text-[9px]
                    text-[#999999]
                  "
                >
                  {country.language}
                </span>
              </div>

              {/* =====================================
                  SELECTED CHECK
              ===================================== */}

              {isSelected && (
                <span
                  className="
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#a42025]
                    text-white
                    shadow-[0_3px_8px_rgba(164,32,37,0.16)]
                  "
                >
                  <Check className="h-3 w-3" />
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}