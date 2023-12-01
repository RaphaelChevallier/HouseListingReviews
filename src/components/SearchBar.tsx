'use client'

import { useQuery } from '@tanstack/react-query'
import { AutoCompleteAddress } from '@/types/radar'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { Building2, ChevronDown, Landmark, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('')
  const [searchType, setSearchType] = useState<string>('Address')
  const pathname = usePathname()
  const commandRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}&searchType=${searchType}`)
      return data.addresses as (AutoCompleteAddress)[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <div className='flex w-[38em]'>
    <Command
      ref={commandRef}
      className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
      <CommandInput
        isLoading={isFetching}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        value={input}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search...'
      />

      {input.length > 0 && (
        <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='Communities'>
              {queryResults?.map((autoCompleteAddress) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                  key={autoCompleteAddress.latitude + autoCompleteAddress.longitude}
                  value={autoCompleteAddress.formattedAddress}>
                  {autoCompleteAddress.layer === "address" || autoCompleteAddress.layer === "street" ? <MapPin className='mr-2 h-4 w-4' /> : null}
                  {autoCompleteAddress.layer === "locality" || autoCompleteAddress.layer === "postalCode" || autoCompleteAddress.layer === "county" || autoCompleteAddress.layer === "neighborhood" ? <Building2 className='mr-2 h-4 w-4' /> : null}
                  {autoCompleteAddress.layer === "state" || autoCompleteAddress.layer === "country" ? <Landmark className='mr-2 h-4 w-4' /> : null}
                  <a href={`/r/${autoCompleteAddress.formattedAddress}`}>{autoCompleteAddress.formattedAddress}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
    <DropdownMenu >
      <DropdownMenuTrigger>
      <Button variant='subtle' className='bg-slate-200 h-full w-[12em] rounded-md'>
        By: {searchType} <ChevronDown/>
      </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <DropdownMenuItem onClick={()=>setSearchType("Address")}>
          Address
        </DropdownMenuItem>

        <DropdownMenuItem onClick={()=>setSearchType("Country")}>
          Country
        </DropdownMenuItem>

        {/* <DropdownMenuItem onClick={()=>setSearchType("State")}>
          State
        </DropdownMenuItem> */}

        {/* <DropdownMenuItem onClick={()=>setSearchType("County")}>
          County
        </DropdownMenuItem> */}

        <DropdownMenuItem onClick={()=>setSearchType("City")}>
          City
        </DropdownMenuItem>

        <DropdownMenuItem onClick={()=>setSearchType("Postal Code")}>
          Postal Code
        </DropdownMenuItem>

        <DropdownMenuItem onClick={()=>setSearchType("User")}>
          User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>    
    </div>
  )
}

export default SearchBar
