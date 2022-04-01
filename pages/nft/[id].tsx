import react from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

function NFTDropPage() {
  //Authentication
  const connectWithMetaMask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  console.log(address)

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left side of the screen */}
      <div className=" bg-gradient-to-br from-blue-300 to-gray-900 lg:col-span-4">
        <div className="item-center flex flex-col items-center justify-center py-2 lg:h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt="NFT"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">P-ARTS Apes</h1>
            <h2 className="text-xl text-gray-300">A collection of NFT Apes</h2>
          </div>
        </div>
      </div>

      {/* Right side of the screen */}
      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{' '}
            <span className="font-extrabold underline decoration-blue-300/50">
              P-ARTS
            </span>{' '}
            NFT Market Place
          </h1>
          <button
            onClick={() => (address ? disconnect() : connectWithMetaMask())}
            className="rounded-full bg-gradient-to-br from from-blue-400 to-gray-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>

        <hr className="my-2 border" />
        {address && (
          <p className="text-transparent bg-clip-text bg-gradient-to-br from-rose-300 to-purple-600 text-center text-sm">
            You're logged in with wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}

        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src="https://links.papareact.com/bdy"
            alt=""
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            The P-ART | NFT DROP
          </h1>
          <p className="pt-2 text-xl text-green-300">13 / 21 NFT's Claimed</p>
        </div>

        {/* Mint Button */}
        <button className="mt-10 h-16 w-full rounded-full bg-gradient-to-br from from-gray-400 to-gray-900 font-bold text-white ">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}
export default NFTDropPage
