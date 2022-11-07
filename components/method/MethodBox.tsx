import React from "react"
import { splitParameters } from "../../utils/abi"
import ParameterInput from "../ParameterInput"

export default class MethodBox extends React.Component<{method: Method, sendTx: (methodName: string, signature: string, types: string[], values: any[]) => void}, {methodName: string, types: string[], values: any[]}> {
    constructor(props: any) {
        super(props)
        this.state = {
            methodName: this.props.method.selector.substring(0, this.props.method.selector.indexOf("(")),
            types: splitParameters(this.props.method.selector.substring(this.props.method.selector.indexOf("(")+1, this.props.method.selector.indexOf(")"))),
            values: []
        }
    }

    render() {
        return (
            <div className="border overflow-hidden bg-slate-900">
                <div className="border-b p-2 cursor-pointer" onClick={() => this.props.sendTx(this.state.methodName, this.props.method.signature, this.state.types, this.state.values)}>
                    <p>{this.state.methodName}</p>
                </div>

                <div className="flex flex-col">
                    {this.state.types.map((t, i) => 
                        <ParameterInput key={i} type={t} initialValue={this.state.values[i]} changeParameter={(value: any) => this.changeParameter(i, value)}/>
                    )}
                </div>
            </div>
        )
    }

    changeParameter = (i: number, value: any) => {
        const values = [...this.state.values]
        values[i] = value
        this.setState({values: values})
    }
}