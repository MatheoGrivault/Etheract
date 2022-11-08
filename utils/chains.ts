import { ethers } from "ethers"
import ETH from "../public/eth.png"
import BSC from "../public/bsc.png"
import POLYGON from "../public/polygon.png"
import AVAX from "../public/avax.png"
import FTM from "../public/ftm.png"
import CUSTOM from "../public/settings.png"

export function getEmptyChains(): Chain[] {
    return [{
        name: "Ethereum",
        chainId: 1,
        icon: ETH,
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcEndpoint: process.env.NEXT_PUBLIC_ETH_ENDPOINT!,
        blockExplorer: "https://etherscan.io",
        methods: []
    },{
        name: "BSC",
        chainId: 56,
        icon: BSC,
        nativeCurrency: {
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18
        },
        rpcEndpoint: process.env.NEXT_PUBLIC_BSC_ENDPOINT!,
        blockExplorer: "https://bscscan.com",
        methods: []
    },{
        name: "Polygon",
        chainId: 137,
        icon: POLYGON,
        nativeCurrency: {
            name: "Polygon",
            symbol: "MATIC",
            decimals: 18
        },
        rpcEndpoint: process.env.NEXT_PUBLIC_POLYGON_ENDPOINT!,
        blockExplorer: "https://polygonscan.com",
        methods: []
    },{
        name: "Avalanche",
        chainId: 43114,
        icon: AVAX,
        nativeCurrency: {
            name: "Avalanche",
            symbol: "AVAX",
            decimals: 18
        },
        rpcEndpoint: process.env.NEXT_PUBLIC_AVAX_ENDPOINT!,
        blockExplorer: "https://snowtrace.io",
        methods: []
    },{
        name: "Fantom",
        chainId: 250,
        icon: FTM,
        nativeCurrency: {
            name: "Fantom",
            symbol: "FTM",
            decimals: 18
        },
        rpcEndpoint: process.env.NEXT_PUBLIC_FTM_ENDPOINT!,
        blockExplorer: "https://ftmscan.com",
        methods: []
    },{
        name: "Goerli",
        chainId: 5,
        icon: ETH,
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcEndpoint: process.env.NEXT_PUBLIC_GOERLI_ENDPOINT!,
        blockExplorer: "https://goerli.etherscan.io",
        methods: []
    },{
        name: "Sepolia",
        chainId: 11155111,
        icon: ETH,
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcEndpoint: process.env.NEXT_PUBLIC_SEPOLIA_ENDPOINT!,
        blockExplorer: "https://sepolia.etherscan.io",
        methods: []
    },{
        name: "Custom",
        chainId: Number((typeof window !== "undefined" ? window.localStorage.getItem("customChainId") : undefined) ?? 1337),
        icon: CUSTOM,
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        rpcEndpoint: (typeof window !== "undefined" ? window.localStorage.getItem("customRpcEndpoint") : undefined) ?? "http://localhost:8545",
        blockExplorer: "https://etherscan.io",
        methods: []
    }]
}

//Get method selectors per chain in one single request to the database
export async function getChains(contract: string): Promise<Chain[]> {
    const chains = getEmptyChains()

    //Get signatures per chain
    const chainCodes = await Promise.all(chains.map<Promise<string>>(c => {
        return new Promise(async resolve => {
            try{
                const provider = new ethers.providers.JsonRpcProvider(c.rpcEndpoint)
                resolve(await provider.getCode(contract))
            }catch{
                resolve("")
            }
        })
    }))

    const chainSignatures = chainCodes.map(c => {
        const signatures = c.match(/(?<=8063)[0-9a-f]{8}|(?<=005b63)[0-9a-f]{8}(?=600051141561)/g) ?? [] //Search for signatures in jump table
        return signatures.filter((sig, i) => signatures.indexOf(sig) == i)
    })

    //Create an array of unique signatures
    var uniqueSignatures = chainSignatures.flat()
    uniqueSignatures = uniqueSignatures.filter((s, i) => uniqueSignatures.indexOf(s) == i)
    
    //Query the signatures database for method selectors
    const dbRequest = process.env.NEXT_PUBLIC_DB_ENDPOINT! + uniqueSignatures.map((sig, i) => (i == 0 ? "?" : "&") + "function=0x" + sig).join("")
    const dbResponse = await (await fetch(dbRequest)).json()
    
    //Return Chain objects
    for(const i in chains){
        chains[i].methods = chainSignatures[i].map<Method>(sig => {
            return {
                signature: sig,
                selector: dbResponse.result.function["0x" + sig].length > 0 ? dbResponse.result.function["0x" + sig][0].name : undefined
            }
        })
    }

    return chains
}