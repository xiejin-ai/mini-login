
import { useSearchParams } from 'react-router-dom'

export const Exception = ()=>{
  const [searchParams] =  useSearchParams()
  return <div>
  {searchParams.get('code') ?? 'ERROR'}
  </div>
}