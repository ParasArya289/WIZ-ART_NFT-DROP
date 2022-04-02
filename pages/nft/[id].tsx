import react from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typing'
import Link from 'next/link'

interface Props {
    collection: Collection
}

function NFTDropPage({collection}:Props) {
  //Authentication
  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  console.log(address)
  console.log(collection.nftcollectionName)

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left side of the screen */}
      <div className=" bg-gradient-to-br from-blue-300 to-gray-900 lg:col-span-4">
        <div className="item-center flex flex-col items-center justify-center py-2 lg:h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt="NFT"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">{collection.nftcollectionName}</h1>
            <h2 className="text-xl text-gray-300">
              {collection.description}
            </h2>
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
            {address ? 'Sign Out' : 'Sign In'}
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
            className="w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
              {collection.title}
          </h1>
          <p className="pt-2 text-xl text-green-300">13 / 21 NFT's Claimed</p>
        </div>

        {/* Mint Button */}
        <button className="from mt-10 h-16 w-full rounded-full bg-gradient-to-br from-gray-400 to-gray-900 font-bold text-white ">
          Mint NFT (0.01 ETH)
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
      const collection = await sanityClient.fetch(query,{
          id: params?.id
      });

      if(!collection) {
          return {
              notFound: true
          }
      }

      return {
          props:{
              collection
          }
      }

}
