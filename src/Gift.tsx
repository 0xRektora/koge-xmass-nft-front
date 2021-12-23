import { useContractCall, useEthers, useTokenBalance } from '@usedapp/core'
import { ethers } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import React from 'react'
//@ts-ignore
import { Shake } from 'reshake'
import { useWeb3Context } from 'web3-react'
import gift from './gift.svg'
import { KogeXMassNFT } from './typechain'
import { useContract } from './useContract'
import ReactPlayer from 'react-player'

function Gift() {
  const { account, library, active } = useEthers()
  const tokenBalanceKoge = useTokenBalance(
    '0x13748d548D95D78a3c83fe3F32604B4796CFfa23',
    account,
  )
  const tokenBalanceVKoge = useTokenBalance(
    '0x992Ae1912CE6b608E0c0d2BF66259ab1aE62A657',
    account,
  )

  const kgxm = useContract<KogeXMassNFT>(
    '0x58187e4ad8E888cE2824158A8c89F5fC538A20c0',
    [
      'function balanceOf(address account) external view returns (uint256)',
      'function mint() external returns (uint256)',
      'function baseUri() external view returns (string)',
    ],
  )
  const [balance, setBalance] = React.useState(false)
  const [uri, setUri] = React.useState('')

  const [giftOpen, setGiftOpen] = React.useState(false)
  const [animationEnded, setAnimationEnded] = React.useState(false)

  const [heightOffset, setHeightOffset] = React.useState(0)

  const updateBalance = React.useCallback(async () => {
    const _balance = (
      (await kgxm?.balanceOf(account ?? '')) ?? ethers.BigNumber.from(0)
    ).gt(0)
    setBalance(_balance)
    if (_balance) {
      setUri((await kgxm?.baseUri()) ?? '')
      console.log(await kgxm?.baseUri())
    }
  }, [account, kgxm])

  React.useEffect(() => {
    ;(async () => {
      await updateBalance()
    })()
  }, [updateBalance])

  const onChangeHover = React.useCallback((hover) => {
    setHeightOffset(hover ? 50 : 0)
  }, [])

  return balance && uri ? (
    <ReactPlayer url={uri} playing loop height="60vh" />
  ) : (
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
      {!animationEnded &&
        !balance &&
        (tokenBalanceKoge?.gte(ethers.utils.parseUnits('50', 9)) ||
          tokenBalanceVKoge?.gte(ethers.utils.parseUnits('20', 9))) && (
          <img
            src={gift}
            style={{
              height: giftOpen ? 300 + heightOffset : 300 - heightOffset,
              transition: 'height 0.5s, opacity 1s',
              cursor: 'pointer',
              opacity: Number(!giftOpen),
            }}
            alt="gift"
            onMouseEnter={() => onChangeHover(true)}
            onMouseLeave={() => onChangeHover(false)}
            onClick={async () => {
              setHeightOffset(heightOffset + 20)
              await (
                await kgxm?.connect(library?.getSigner() ?? '')?.mint()
              )?.wait()
              setGiftOpen(true)
              setTimeout(async () => {
                setAnimationEnded(true)
                updateBalance()
              }, 1000)
            }}
          />
        )}
    </Shake>
  )
}

export default React.memo(Gift)
