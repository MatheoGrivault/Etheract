import React from "react"
import Image from "next/image"

export default class ChainTab extends React.Component<{chain: Chain, selected: boolean, changeChain: () => void}> {
    render() {
        return (
            <div className={"flex gap-1 cursor-pointer p-2 border " + (this.props.selected && "bg-slate-600")} onClick={this.props.changeChain}>
                <Image className="w-6 h-6" src={this.props.chain.icon} alt=""/>
                <p className="pl-1">{this.props.chain.name}</p>
            </div>
        )
    }
}