import { ethers } from "ethers"
import { StaticImageData } from "next/image"

export {}

declare global {
    type Chain = {
        name: string
        chainId: number
        icon: StaticImageData
        nativeCurrency: {
            name: string
            symbol: string
            decimals: 18
        }
        rpcEndpoint: string
        blockExplorer: string
        methods: Method[]
    }

    type Method = {
        signature: string
        selector: string
    }

    interface Window {
        ethereum: ethers.providers.ExternalProvider
    }
}