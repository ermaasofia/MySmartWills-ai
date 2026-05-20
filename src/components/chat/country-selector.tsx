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
import { ChevronDown } from 'lucide-react';
import { CountryFlag } from '@/components/ui/country-flag';

interface CountrySelectorProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}

export function CountrySelector({ selectedCountry, onSelect }: CountrySelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 min-w-[130px] sm:min-w-[180px] justify-between">
          <span className="flex items-center gap-1.5 sm:gap-2 truncate">
            <CountryFlag code={selectedCountry.code} className="h-3.5 w-5 object-cover" />
            <span className="text-sm sm:text-base truncate">{selectedCountry.name}</span>
          </span>
          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[220px] max-h-[400px] overflow-y-auto">
        {COUNTRIES.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => onSelect(country)}
            className="cursor-pointer gap-3"
          >
            <CountryFlag code={country.code} name={country.name} className="h-4 w-6 object-cover" />
            <div className="flex flex-col">
              <span className="font-medium">{country.name}</span>
              <span className="text-sm text-muted-foreground">{country.language}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
