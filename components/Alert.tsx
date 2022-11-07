import React from "react"

export default class Alert extends React.Component<{className: string, alert?: {title: string, content: React.ReactNode}}, {shown: boolean}> {
    timerId?: NodeJS.Timeout

    constructor(props: any){
        super(props)
        this.state = {
            shown: false
        }
    }

    componentDidUpdate(prevProp: any) {
        if(prevProp.alert == this.props.alert) return
        clearTimeout(this.timerId)
        this.setState({shown: true})
        this.timerId = setTimeout(() => this.setState({shown: false}), 10000)
    }

    componentWillUnmount() {
        clearTimeout(this.timerId)
    }

    render() {
        return this.state.shown && (
            <div className={"whitespace-pre-line break-all " + this.props.className}>
                <p><strong className="text-xl">{this.props.alert?.title}</strong></p>
                {this.props.alert?.content}
            </div>
        )
    }
}