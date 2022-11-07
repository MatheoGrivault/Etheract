import React from "react";
import MethodBox from "./MethodBox";

export default class MethodList extends React.Component<{methods: Method[], sendTx: (methodName: string, signature: string, parameters: string[], values: string[]) => void}> {
    render() {
        return (
            <div className="flex flex-wrap justify-center gap-2">
                {this.props.methods.map(m =>
                    m.selector && <MethodBox key={m.signature} method={m} sendTx={this.props.sendTx}/>
                )}
            </div>
        )
    }
}