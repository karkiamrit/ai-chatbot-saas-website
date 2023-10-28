import React from 'react'
import { UserButton } from "@clerk/nextjs";
 
type Props = {}

const RootPage = (props: Props) => {
  return (
    <div >
        Root Page (Protected)
        <UserButton afterSignOutUrl="/" />
    </div>
  )
}

export default RootPage