'use client'

import { useQuery } from '@tanstack/react-query'
import { AutoCompleteAddress } from '@/types/radar'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { RegionType, User } from '@prisma/client'

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
      if(searchType != 'User'){
        return data.addresses as (AutoCompleteAddress)[]
      } else {
        return data as (User)[]
      }
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <div className='flex w-[35em] items-center'>
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
            <CommandGroup>
              {queryResults?.map((autoComplete) => {
                if((autoComplete as AutoCompleteAddress).formattedAddress){
                return (
                <CommandItem
                  onSelect={() => {
                    router.refresh()
                  }}
                  key={(autoComplete as AutoCompleteAddress).latitude + (autoComplete as AutoCompleteAddress).longitude}
                  value={(autoComplete as AutoCompleteAddress).formattedAddress}>
                  {(autoComplete as AutoCompleteAddress).layer === "address" || (autoComplete as AutoCompleteAddress).layer === "street" ? <Link className='flex' href={`/${RegionType.ADDRESS}/${(autoComplete as AutoCompleteAddress).formattedAddress}`}><MapPin className='mr-2 h-4 w-4' />{(autoComplete as AutoCompleteAddress).formattedAddress}</Link>: null}
                  {(autoComplete as AutoCompleteAddress).layer === "locality" || (autoComplete as AutoCompleteAddress).layer === "neighborhood" ? <Link className='flex' href={`/${RegionType.CITY}/${(autoComplete as AutoCompleteAddress).formattedAddress}`}><Building2 className='mr-2 h-4 w-4' />{(autoComplete as AutoCompleteAddress).formattedAddress}</Link>: null}
                  {(autoComplete as AutoCompleteAddress).layer === "postalCode" ? <Link className='flex' href={`/${RegionType.ZIP}/${(autoComplete as AutoCompleteAddress).formattedAddress}`}><Building2 className='mr-2 h-4 w-4' />{(autoComplete as AutoCompleteAddress).formattedAddress}</Link>: null}
                  {(autoComplete as AutoCompleteAddress).layer === "county" ? <Link className='flex' href={`/${RegionType.COUNTY}/${(autoComplete as AutoCompleteAddress).formattedAddress}`}><Building2 className='mr-2 h-4 w-4' />{(autoComplete as AutoCompleteAddress).formattedAddress}</Link>: null}
                  {(autoComplete as AutoCompleteAddress).layer === "state" ? <Link className='flex' href={`/${RegionType.STATE}/${(autoComplete as AutoCompleteAddress).formattedAddress}`}><Landmark className='mr-2 h-4 w-4' />{(autoComplete as AutoCompleteAddress).formattedAddress}</Link>: null}
                  {(autoComplete as AutoCompleteAddress).layer === "country" ? <Link className='flex' href={`/${RegionType.COUNTRY}/${(autoComplete as AutoCompleteAddress).formattedAddress}`}><Landmark className='mr-2 h-4 w-4' />{(autoComplete as AutoCompleteAddress).formattedAddress}</Link>: null}
                </CommandItem>)
              } else if((autoComplete as User).username){
                return (
                <CommandItem
                  key={(autoComplete as User).id}
                  value={(autoComplete as User).username?? ''}>
                   <Users className='mr-2 h-4 w-4' />
                  <a className='w-full' href={`/u/${(autoComplete as User).username}`}>{(autoComplete as User).username}</a>
                </CommandItem>)
              }})}
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

        <DropdownMenuItem onClick={()=>setSearchType("State")}>
          State
        </DropdownMenuItem>

        <DropdownMenuItem onClick={()=>setSearchType("County")}>
          County
        </DropdownMenuItem>

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
