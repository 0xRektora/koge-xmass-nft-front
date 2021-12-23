import { useEthers } from '@usedapp/core'
import React from 'react'
import img from './bg.jpg'
import Gift from './Gift'

function App() {
  const { activateBrowserWallet, account } = useEthers()

  React.useEffect(() => {
    if (!account) {
      activateBrowserWallet()
    }
  }, [])

  return (
    <div
      style={{
        backgroundImage: `url(${img})`,
        height: '100vh',
        backgroundSize: 'cover',
        display: 'grid',
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      {account && <Gift />}
    </div>
  )
}

export default App
