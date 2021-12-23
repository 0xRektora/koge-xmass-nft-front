import React from 'react'
import img from './bg.jpg'
import gift from './gift.svg'
//@ts-ignore
import { Shake } from 'reshake'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

function App() {
  const context = useWeb3Context()
  const [etherjs, setEtherjs] = React.useState<typeof ethers | undefined>(
    undefined,
  )
  const [giftOpen, setGiftOpen] = React.useState(false)

  React.useEffect(() => {
    context.setFirstValidConnector(['MetaMask', 'Infura'])
  }, [])

  React.useEffect(() => {
    if (context.active) {
      setEtherjs(context.library)
    }
  }, [context.active, context.library])

  const [heightOffset, setHeightOffset] = React.useState(0)

  const onChangeHover = React.useCallback((hover) => {
    setHeightOffset(hover ? 50 : 0)
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
      <Shake
        h={5}
        v={5}
        r={3}
        dur={750}
        int={10}
        max={100}
        fixed={true}
        fixedStop={false}
      >
        <img
          src={gift}
          style={{
            height: 300 - heightOffset,
            transition: 'height 0.5s',
            cursor: 'pointer',
          }}
          alt="gift"
          onMouseEnter={() => onChangeHover(true)}
          onMouseLeave={() => onChangeHover(false)}
        />
      </Shake>
    </div>
  )
}

export default App
