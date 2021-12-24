import { useEthers, useTokenBalance } from '@usedapp/core'
import { ethers } from 'ethers'
import React from 'react'
import ReactPlayer from 'react-player'
//@ts-ignore
import { Shake } from 'reshake'
import gift from './gift.svg'
import { KogeXMassNFT } from './typechain'
import { useContract } from './useContract'

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
    '0xdB878fbF58533c18108d91eFbc570d9E6d7B9948',
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

  const [muted, setMuted] = React.useState(true)

  React.useEffect(() => {
    ;(async () => {
      setUri((await kgxm?.baseUri()) ?? '')
    })()
  }, [])

  const updateBalance = async () => {
    const _balance = (
      (await kgxm?.balanceOf(account ?? '')) ?? ethers.BigNumber.from(0)
    ).gt(0)
    setBalance(_balance)
  }

  React.useEffect(() => {
    ;(async () => {
      await updateBalance()
    })()
  }, [account])

  const onChangeHover = React.useCallback((hover) => {
    setHeightOffset(hover ? 50 : 0)
  }, [])

  const shaking = React.useMemo(
    () =>
      tokenBalanceKoge?.gte(ethers.utils.parseUnits('50', 9)) ||
      tokenBalanceVKoge?.gte(ethers.utils.parseUnits('20', 9)),
    [tokenBalanceKoge, tokenBalanceVKoge],
  )

  const onClickGift = async () => {
    if (shaking) {
      setHeightOffset(heightOffset + 20)
      await (await kgxm?.connect(library?.getSigner() ?? '')?.mint())?.wait()
      setGiftOpen(true)
      setTimeout(async () => {
        setAnimationEnded(true)
        setTimeout(() => window.location.reload(), 500)
      }, 1000)
    } else {
      alert('You need 50 Koge or 20vKogeKoge!')
    }
  }
  if (!uri) return <></>

  return balance ? (
    <div onClick={() => setMuted(false)}>
      <ReactPlayer url={uri} playing muted={muted} loop height="60vh" />
    </div>
  ) : (
    <Shake
      h={5}
      v={5}
      r={3}
      dur={750}
      int={10}
      max={100}
      fixed={shaking}
      fixedStop={false}
    >
      {!animationEnded && (
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
          onClick={() => onClickGift()}
        />
      )}
    </Shake>
  )
}

export default React.memo(Gift)
