import { Triangle } from 'lucide-react'

interface VegSymbolProps {
  isNonVeg: boolean
}

const VegSymbol = ({ isNonVeg }: VegSymbolProps) => {
  if (isNonVeg) {
    return (
      <div className='border-2 rounded-md border-red-900 flex items-center justify-center size-5 mb-1'>
        <Triangle size={10} color='brown' fill='brown' />
      </div>
    )
  }

  return (
    <div className='border-2 rounded-md border-green-700 flex items-center justify-center size-5 mb-1'>
      <div className='p-1 bg-green-700 rounded-full size-2'></div>
    </div>
  )
}

export default VegSymbol
