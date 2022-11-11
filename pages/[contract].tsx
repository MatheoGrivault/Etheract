import React from "react"
import { NextRouter, withRouter } from "next/router"
import Head from "next/head"
import { ethers } from "ethers"
import { connectWallet, switchNetwork } from "../utils/wallet"
import { getChains, getEmptyChains } from "../utils/chains"
import Alert from "../components/Alert"
import ChainList from "../components/chain/ChainList"
import MethodList from "../components/method/MethodList"
import Options from "../components/Options"
import CustomChainConfig from "../components/CustomChainConfig"

class Contract extends React.Component<{router: NextRouter}, {chains: Chain[], selectedChain: number, value: string, isCall: boolean, loaded: boolean, alert?: {title: string, content: React.ReactNode}, customChainConfig: boolean}> {
    constructor(props: any){
        super(props)
        this.state = {
            chains: getEmptyChains(),
            selectedChain: 0,
            value: "",
            isCall: false,
            loaded: false,
            alert: undefined,
            customChainConfig: false
        }
    }

    componentDidMount() {
        if(this.props.router.isReady) this.getChains()
    }

    componentDidUpdate(prevProps: any) {
        if(prevProps.router.isReady != this.props.router.isReady) this.getChains()
    }

    getChains = async() => {
        const chains = await getChains(this.props.router.query.contract as string)
        this.setState({
            chains: chains,
            //Selects the chain with the most methods
            selectedChain: chains.map<{0: Chain, 1: number}>((c, i) => [c, i]).reduce((p, c) => (c[0].methods.length > p[0].methods.length ? c : p))[1],
            loaded: true
        })
    }

    render() {
        return (
            <div>
                <Head>
                    <title>{`Etheract - ${this.props.router.query.contract ?? ""}`}</title>
                </Head>

                <p className="text-center text-3xl my-4"><a href={`${this.state.chains[this.state.selectedChain].blockExplorer}/address/${this.props.router.query.contract}`} target="_blank" rel="noreferrer">{this.props.router.query.contract}</a></p>

                <ChainList className="mb-2" chains={this.state.chains} selectedChain={this.state.selectedChain} changeChain={(i: number) => this.setState({selectedChain: i})} showCustomChainConfig={() => this.setState({customChainConfig: true})}/>

                {this.state.loaded ?
                    <MethodList methods={this.state.chains[this.state.selectedChain].methods} sendTx={this.sendTx}/>
                    :
                    <p className="text-center text-xl"><strong>Loading...</strong></p>
                }

                <Alert className="w-1/2 fixed right-2 bottom-11 bg-slate-900 p-2 border-2 rounded-md shadow-2x" alert={this.state.alert}/>

                <Options className="fixed bottom-0 w-full border-t" isCall={this.state.isCall} setCall={(isCall: boolean) => this.setState({isCall: isCall})} value={this.state.value} setValue={(value: string) => this.setState({value: value})}/>

                {this.state.customChainConfig && <CustomChainConfig hide={() => this.setState({customChainConfig: false})}/>}
            </div>
        )
    }

    sendTx = async(methodName: string, signature: string, types: string[], values: any[]) => {
        if(!(await switchNetwork(this.state.chains[this.state.selectedChain]))) return

        const signer = await connectWallet()
        if(!signer) return
        
        try{
            const tx: ethers.providers.TransactionRequest = {
                from: await signer.getAddress(),
                to: this.props.router.query.contract as string,
                data: "0x" + signature + ethers.utils.defaultAbiCoder.encode(types, values).substring(2),
                value: ethers.utils.parseEther(this.state.value ? this.state.value : "0")
            }

            if(this.state.isCall) {
                const callResponse = await signer.call(tx)

                var text = undefined
                try{
                    text = `\nText: ${ethers.utils.defaultAbiCoder.decode(["string"], callResponse)}`
                }catch{}

                this.setState({
                    alert: {
                        title: methodName,
                        content: `Raw: ${callResponse + (text ?? "")}`
                    }
                })
            }else{
                const txResponse = await signer.sendTransaction(tx)
                const txLink = <a href={`${this.state.chains[this.state.selectedChain].blockExplorer}/tx/${txResponse.hash}`} target="_blank"  rel="noreferrer">{txResponse.hash}</a>
                this.setState({
                    alert: {
                        title: methodName,
                        content: [`Transaction sent\nHash: `, txLink]
                    }
                })
                const txReceipt = await txResponse.wait()
                this.setState({
                    alert: {
                        title: methodName,
                        content: [`${txReceipt.status ? "Transaction success" : "Transaction reverted"}\nHash: `, txLink]
                    }
                })
            }
        }catch(err: any){
            this.setState({
                alert: {
                    title: "Error",
                    content: err.toString()
                }
            })
        }
    }
}

export default withRouter(Contract)