'use client'
import { Button } from '@/components/ui/Button'
import { revalidatePath } from 'next/cache'
import { useState } from 'react';
import { RadiusUnits, RegionType } from '@prisma/client';
import { Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

interface RadiusUnitsChangeProps {
    props: {
        radius: number
        radiusUnits: RadiusUnits
    },
    params: {
        regionType: RegionType,
        location: string
    }
}

const RadiusUnitsChange = ({ props, params
}: RadiusUnitsChangeProps) => {
    const [radiusUnits, setRadiusUnits] = useState(props.radiusUnits);
    const [radius, setRadius] = useState(props.radius.toString())
    const [error, setError] = useState("")
    const router = useRouter();

function newPageHandler () {
    router.push(`/${params.regionType}/${decodeURIComponent(params.location)}?radius=${radius}&radiusUnits=${radiusUnits}`)
}

function setNewValue(value: string){
    if(parseFloat(value) <= 0){
        setRadius("")
        setError("Please use positive distance")
    } else{
        setError("")
        router.prefetch(`/${params.regionType}/${params.location}?radius=${value}&radiusUnits=${radiusUnits}`)
        setRadius(value)
    }
}

function setNewUnitValue(value: string){
    let radiusUnit: RadiusUnits
    if(value === "MILES"){
        radiusUnit = RadiusUnits.MILES;
    } else if(value === "METERS"){
        radiusUnit = RadiusUnits.METERS;
    } else if(value === "YARDS"){
        radiusUnit = RadiusUnits.YARDS;
    } else {
        radiusUnit = RadiusUnits.KILOMETERS;
    }
    router.prefetch(`/${params.regionType}/${params.location}?radius=${radiusUnit}&radiusUnits=${radiusUnits}`)
    setRadiusUnits(radiusUnit)
}

  return (
        <div className='flex items-center justify-center mb-4'>
        <Input
          className='w-[70%]'
          placeholder={props.radius.toString()}
          labelPlacement="outside"
          value={radius}
          isInvalid={error != ""? true : false}
          errorMessage={error}
          variant='bordered'
          radius='md'
          onBlur={newPageHandler}
          onValueChange={(e) => setNewValue(e)}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">Radius:</span>
            </div>
          }
          endContent={
            <div className="flex items-center">
              <label className="sr-only" htmlFor="radius">
                Radius
              </label>
              <select
                onBlur={newPageHandler}
                onChange={e => setNewUnitValue(e.target.value)}
                defaultValue={radiusUnits}
                className="outline-none border-0 bg-transparent text-default-800 text-small"
                id="radiusUnits"
                name="radiusUnits"
              >
                <option value={RadiusUnits.KILOMETERS}>Kilometers</option>
                <option value={RadiusUnits.MILES}>Miles</option>
                <option value={RadiusUnits.METERS}>Meters</option>
                <option value={RadiusUnits.YARDS}>Yards</option>
              </select>
            </div>
          }
          type="number"
        />
        </div>
  ) 
}

export default RadiusUnitsChange
