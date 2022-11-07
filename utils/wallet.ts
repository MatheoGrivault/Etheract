import { ethers } from "ethers"

export async function switchNetwork(chain: Chain): Promise<boolean> {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    try {
        await provider.send("wallet_switchEthereumChain", [{chainId: ethers.utils.hexStripZeros(ethers.utils.hexlify(chain.chainId))}])
        return true
    }catch(err: any){
        if(err.code == 4902){
            const params = {
                chainId: ethers.utils.hexStripZeros(ethers.utils.hexlify(chain.chainId)),
                chainName: chain.name,
                nativeCurrency: {
                    name: chain.nativeCurrency.name,
                    symbol: chain.nativeCurrency.symbol,
                    decimals: chain.nativeCurrency.decimals
                },
                rpcUrls: [chain.rpcEndpoint],
                blockExplorerUrls: [chain.blockExplorer]
            }

            try{
                await provider.send("wallet_addEthereumChain", [params])
                return true
            }catch{}
        }
    }

    return false
}

export async function connectWallet(): Promise<ethers.providers.JsonRpcSigner | undefined> {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    try{
        await provider.send("eth_requestAccounts", [])
        return provider.getSigner()
    }catch{}
    
    return undefined
}