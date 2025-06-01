import React from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { availableStocks, availablePeriods } from '../utils/stockApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface StockSelectorProps {
  selectedStocks: string[];
  selectedPeriod: string;
  onStocksChange: (stocks: string[]) => void;
  onPeriodChange: (period: string) => void;
}

export function StockSelector({
  selectedStocks,
  selectedPeriod,
  onStocksChange,
  onPeriodChange
}: StockSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const toggleStock = (symbol: string) => {
    if (selectedStocks.includes(symbol)) {
      onStocksChange(selectedStocks.filter(s => s !== symbol));
    } else {
      onStocksChange([...selectedStocks, symbol]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Sélection de la Période
        </h3>
        <Select value={selectedPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une période" />
          </SelectTrigger>
          <SelectContent>
            {availablePeriods.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Sélection des Actions
        </h3>
        <Popover open={open} onOpenChange={setOpen}>          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedStocks.length === 0
                ? "Sélectionnez des actions..."
                : `${selectedStocks.length} action(s) sélectionnée(s)`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Rechercher une action..." className="h-9" />
              <CommandEmpty>Aucune action trouvée.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {availableStocks.map((stock) => (
                  <CommandItem
                    key={stock.symbol}
                    value={stock.symbol}
                    onSelect={() => {
                      toggleStock(stock.symbol);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                  >
                    <div className="min-w-[16px]">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedStocks.includes(stock.symbol)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                    <span>{stock.symbol} - {stock.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedStocks.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedStocks.map((symbol) => {
            const stock = availableStocks.find(s => s.symbol === symbol);
            return (
              <div
                key={symbol}
                className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm flex items-center gap-2"
              >
                <span>{stock?.name || symbol}</span>
                <button
                  onClick={() => toggleStock(symbol)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}