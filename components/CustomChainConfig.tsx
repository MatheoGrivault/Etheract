import React from "react"

export default class CustomChain extends React.Component<{hide: () => void}, {rpcEndpoint: string, chainId: string}> {
    constructor(props: any) {
        super(props)
        this.state = {
            rpcEndpoint: window.localStorage.getItem("customRpcEndpoint") ?? "http://localhost:8545",
            chainId: window.localStorage.getItem("customChainId") ?? "1337"
        }
    }

    render() {
        return (
            <div className="flex justify-center items-center fixed left-0 top-0 w-full h-full bg-black/50">
                <div className="px-2 py-3 bg-slate-900 border rounded-xl">
                    <input className="w-full" placeholder="RPC Endpoint" value={this.state.rpcEndpoint} onChange={(e) => this.setState({rpcEndpoint: (e.target as HTMLInputElement).value})}/>
                    <input className="w-full mt-2" placeholder="Chain ID" value={this.state.chainId} onChange={this.handleChainIdChange}/>
                    <div className="flex justify-center mt-2">
                        <button className="bg-red-700" onClick={this.props.hide}>Cancel</button>
                        <button className="ml-2 bg-lime-700" onClick={this.saveConfig}>OK</button>
                    </div>
                </div>
            </div>
        )
    }

    saveConfig = () => {
        window.localStorage.setItem("customRpcEndpoint", this.state.rpcEndpoint)
        window.localStorage.setItem("customChainId", this.state.chainId)
        this.props.hide()
        window.location.reload()
    }

    handleChainIdChange = (e: React.FormEvent) => {
        const v = (e.target as HTMLInputElement).value
        if(!/^[0-9]+$/.test(v)) e.preventDefault()
        else this.setState({chainId: v})
    }
}