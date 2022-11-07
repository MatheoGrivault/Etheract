import React from "react"
import Image from "next/image"
import SETTINGS from "../../public/settings.png"
import ChainTab from "./ChainTab"

export default class ChainList extends React.Component<{className: string, chains: Chain[], selectedChain: number, changeChain: (i: number) => void, showCustomChainConfig: () => void}> {
    render() {
        return (
            <div className={"flex justify-center items-center gap-2 " + this.props.className}>
                {this.props.chains.map((c, i) =>
                    <ChainTab key={c.name} chain={c} selected={this.props.selectedChain == i} changeChain={() => this.props.changeChain(i)}/>
                )}
                {this.props.selectedChain == this.props.chains.length-1 && 
                    <div className="pl-1">
                        <Image className="w-6 h-6 cursor-pointer" src={SETTINGS} alt="" onClick={this.props.showCustomChainConfig}/>
                    </div>
                }
            </div>
        )
    }
}