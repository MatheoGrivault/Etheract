import React from "react"
import Image from "next/image"
import ARROW from "../public/arrow.png"
import MINUS from "../public/minus.png"
import PLUS from "../public/plus.png"
import { splitParameters } from "../utils/abi"

export default class ParameterInput extends React.Component<{type: string, initialValue: any, changeParameter: (value: any) => void}, {isArray: boolean, isTuple: boolean, value: any, valueUUIDs: any[], isExpanded: boolean}> {
    constructor(props: any){
        super(props)
        this.state = {
            isArray: this.props.type.endsWith("[]"),
            isTuple: this.props.type.startsWith("(") && this.props.type.endsWith(")"),
            value: this.props.initialValue ?? [undefined],
            valueUUIDs: Array.from(Array(this.props.initialValue?.length ?? 1), Math.random),
            isExpanded: false
        }
    }

    render() {
        if(!this.state.isArray && !this.state.isTuple)
            return <input className="h-8" placeholder={this.props.type} value={this.state.value} onChange={(e) => this.handleParameterChange((e.target as HTMLInputElement).value)}/>

        const parameters: React.ReactNode[] = []

        if(this.state.isArray){
            for(let i=0; i<this.state.value.length; i++) {
                parameters.push(<ParameterInput key={this.state.valueUUIDs[i]} type={this.props.type.substring(0, this.props.type.length-2)} initialValue={this.state.value[i]} changeParameter={(value: any) => this.handleParameterChange(value, i)}/>)
            }
        }else if(this.state.isTuple){
            splitParameters(this.props.type.substring(1, this.props.type.length-1)).forEach((t, i) => {
                parameters.push(<ParameterInput key={this.state.valueUUIDs[i]} type={t} initialValue={this.state.value[i]} changeParameter={(value: any) => this.handleParameterChange(value, i)}/>)
            })
        }

        return (
            <div className="flex flex-col">
                {parameters.map((p, i) => {
                    return (this.state.isExpanded || i == 0) && (
                        <div className={"pl-3 flex group"}>
                            {i == 0 ?
                                <Image className={`w-2 h-3 mt-3 cursor-pointer ${this.state.isExpanded && "rotate-90"}`} src={ARROW} alt="" onClick={() => this.setState({isExpanded: !this.state.isExpanded})}/>
                                :
                                !this.state.isTuple && <Image className={`w-2 h-3 mt-3 cursor-pointer opacity-0 group-hover:opacity-100`} src={MINUS} alt="" onClick={() => this.removeValue(i)}/>
                            }
                            {p}
                        </div>
                    )
                })}
                {this.state.isExpanded && !this.state.isTuple && (
                        <div className="flex justify-center items-center h-5 cursor-pointer" onClick={this.addValue}>
                            <Image className="w-3 h-3" src={PLUS} alt=""/>
                        </div>
                    )
                }
            </div>
        )
    }

    handleParameterChange = (value: any, i?: number) => {
        if(i != undefined){
            const v = [...this.state.value]
            v[i] = value
            this.setState({value: v})
            
            this.props.changeParameter(v)
        }else{
            this.setState({value: value})
            this.props.changeParameter(value)
        }
    }

    addValue = () => {
        const v = [...this.state.value]
        const vUUIDs = [...this.state.valueUUIDs]
        v.push(undefined)
        vUUIDs.push(Math.random())
        this.setState({value: v, valueUUIDs: vUUIDs})

        this.props.changeParameter(v)
    }

    removeValue = (i: number) => {
        const v = [...this.state.value]
        const vUUIDs = [...this.state.valueUUIDs]
        v.splice(i, 1)
        vUUIDs.splice(i, 1)
        this.setState({value: v, valueUUIDs: vUUIDs})

        this.props.changeParameter(v)
    }
}