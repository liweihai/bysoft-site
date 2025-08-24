'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="inline-flex border rounded w-full px-2 lg:px-6 h-10 bg-transparent">
            <div className="flex flex-wrap items-stretch w-full h-full mb-6 relative">
                <div className="flex">
                    <Button variant="ghost" size="icon" className="size-10">
                        <MagnifyingGlassIcon />
                    </Button>
                </div>
                <Input className="shadow-none focus-visible:border-ring-0 focus-visible:ring-0 flex-shrink flex-grow flex-auto leading-normal tracking-wide w-px flex-1 border border-none border-l-0 rounded rounded-l-none relative focus:outline-none text-xxs lg:text-xs lg:text-base text-gray-500 font-thin"
                    type="text" 
                    placeholder={placeholder} 
                    onChange={(e) => {
                        e.preventDefault();
                        handleSearch(e.target.value);
                    }}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>
        </div>
);
}