import React from "react";

export default class Options extends React.Component<{className: string, isCall: boolean, setCall: (isCall: boolean) => void, value: string, setValue: (value: string) => void}> {
    render() {
        return (
            <div className={"text-center bg-slate-800 " + this.props.className}>
                <label className="mx-1">
                    <input className="mr-1" type="checkbox" onChange={(e) => this.props.setCall(e.target.checked)} checked={this.props.isCall}/>
                    Call
                </label>
                <input className="ml-1 bg-slate-900 h-full" placeholder="Value" onChange={this.handleValueInput} value={this.props.value}/>
            </div>
        )
    }

    handleValueInput = (e: React.FormEvent) => {
        const v = (e.target as HTMLInputElement).value
        if(v && (!/^[0-9.]+$/.test(v) || (v.match(/\./g) || []).length > 1)) {
            e.preventDefault()
        }else this.props.setValue(v)
    }
}