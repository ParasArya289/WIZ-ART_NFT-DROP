import react, { useEffect, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
  useWalletConnect,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typing'
import Link from 'next/link'
import { BigNumber } from '@ethersproject/bignumber'
import toast, { Toaster } from 'react-hot-toast'
import Head from 'next/head'

interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [name, setName] = useState<string>()
  const [priceInEth, setPriceInEth] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const [priceLoading, setPriceLoading] = useState<boolean>(true)
  const [imageLoading, setImageLoading] = useState<boolean>(true)
  const [nextNftLoad, setNextNftLoad] = useState<boolean>(true)

  const [currentImage, setCurrentImage] = useState<string>('')

  const nftDrop = useNFTDrop(collection.address)

  const data = async () => {
    if (!nftDrop) return
    const [{ properties }]: any = await nftDrop.getAllUnclaimed()
    console.log(properties)
  }
  data()

  ////Authentication///
  const connectWithMetaMask = useMetamask()
  // const connectWithWallectConnect = useWalletConnect()
  const address = useAddress()
  const disconnect = useDisconnect()

  useEffect(() => {
    if (!nftDrop) return

    const fetchPrice = async () => {
      setPriceLoading(true)

      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)

      setPriceLoading(false)
    }
    fetchPrice()
  }, [nftDrop, nextNftLoad])

  useEffect(() => {
    const timeout = function () {
      return new Promise(function (_, reject) {
        setTimeout(function () {
          reject(new Error(`Request took too long! Timeout after ${10} second`))
        }, 20 * 1000)
      })
    }
    const fetchNextNFTImg = async () => {
      try {
        setImageLoading(true)
        if (!nftDrop) return
        const dataNft: any = await Promise.race([
          nftDrop.getAllUnclaimed(),
          timeout(),
        ])

        setCurrentImage(dataNft?.[0].image)
        setName(dataNft?.[0].name)
      } catch (err) {
        console.log(err)
      } finally {
        setImageLoading(false)
      }
    }
    fetchNextNFTImg()
  }, [nftDrop, nextNftLoad])

  //fetch claimed and total info
  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)

      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
    }
    fetchNFTDropData()
  }, [nftDrop, nextNftLoad])

  const mintNFT = () => {
    if (!nftDrop || !address) return

    const quantity = 1
    setLoading(true)
    const notification = toast.loading('Please Wait Minting...', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: '17px',
        padding: '20px',
      },
    })

    //returns promise
    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt // transaction receipt
        const claimedTokenID = tx[0].id // id of the claimed NFT
        const claimedNFT = await tx[0].data()

        setNextNftLoad(true)
        toast('Successfully Minted NFT', {
          duration: 8000,
          style: {
            background: 'green',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
        setNextNftLoad(false)

        // console.log(receipt)
        // console.log(claimedTokenID)
        // console.log(claimedNFT)
      })
      .catch((err) => {
        console.error(err)
        toast('Oops... Something went wrong!', {
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
      })
  }
  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />
      <Head>
        <title>WIZ-ART | NFT</title>
      </Head>
      {/* Left side of the screen */}
      <div className="bg-gradient-to-br from-blue-300 to-gray-900 lg:col-span-4">
        <div className="item-center flex flex-col items-center justify-center py-2 lg:h-screen">
          <div
            className={`${
              imageLoading || loading ? ' animate-pulse' : ''
            } rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2`}
          >
            {imageLoading ? (
              <div className="h-44 w-44">
              </div>
            ) : (
              <img
                className={`h-44 w-44 rounded-xl object-cover lg:h-56 lg:w-56`}
                src={currentImage || urlFor(collection.previewImage).url()}
                alt="NFT"
              />
            )}
          </div>
          <div className="space-y-2 p-5 text-center">
            {imageLoading ? (
              <div className="flex justify-center">
                <img
                  className="h-5 w-5 animate-spin"
                  src="https://www.freeiconspng.com/thumbs/load-icon-png/load-icon-png-27.png"
                  alt="nft"
                ></img>
              </div>
            ) : (
              <h1 className="text-4xl font-bold text-white">
                {`${collection.nftcollectionName} | ${name ? name : "#1"}`}
              </h1>
            )}
            <h2 className="text-xl text-gray-300">{collection.description}</h2>
          </div>
        </div>
      </div>

      {/* Right side of the screen */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/">
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The{' '}
              <span className="font-extrabold underline decoration-blue-300/50">
                WIZ-ART
              </span>{' '}
              NFT Market Place
            </h1>
          </Link>
          <button
            onClick={() => (address ? disconnect() : connectWithMetaMask())}
            className="from rounded-full bg-gradient-to-br from-blue-400 to-gray-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
        </header>

        <hr className="my-2 border" />
        {address && (
          <p className="bg-gradient-to-br from-rose-300 to-purple-600 bg-clip-text text-center text-sm text-transparent">
            You're logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}

        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="m-10 w-44 rounded-full object-cover lg:w-60"
            src={urlFor(collection.mainImage).url()}
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
          </h1>
          {loading ? (
            <p className="pt-2 text-xl text-green-300"> Loading Supply...</p>
          ) : (
            <p className="pt-2 text-xl text-green-300">
              {claimedSupply} / {totalSupply?.toString()} NFT's Claimed
            </p>
          )}
          {loading && (
            <img
              className="h-20 w-20 object-contain"
              src="https://i.pinimg.com/originals/fa/87/77/fa87774590186b287a5338d7c87afc0c.gif"
              alt="loading"
            />
          )}
        </div>

        {/* Mint Button */}
        <button
          onClick={mintNFT}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="from mt-10 h-16 w-full rounded-full bg-gray-800 font-bold text-white disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading...</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>Sold Out</>
          ) : !address ? (
            <>Connect wallet to Mint</>
          ) : priceLoading ? (
            <span className="animate-pulse font-bold">Loading Price..</span>
          ) : (
            <span className="font-bold">Mint NFT({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}
export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id][0]{
        _id,
        title,
        address,
        description,
        nftcollectionName,
        mainImage{
          asset
        },
        previewImage{
          asset
        },
        slug {
            current
        },
        creator-> {
          _id,
          name,
          address,
          slug {
            current
          },
        },
      }`
  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    //returns 404 page
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
