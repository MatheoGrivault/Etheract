import { NextRouter, withRouter } from "next/router"
import Head from "next/head"
import React from "react"

class Home extends React.Component<{router: NextRouter}> {
  keyDown = (e: React.KeyboardEvent) => {
    if(e.key == "Enter") this.props.router.push("/" + (e.target as HTMLInputElement).value)
  }

  render() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Head>
          <title>Etheract</title>
        </Head>

        <p className="text-4xl mb-3">Etheract</p>
        <p>Quickly interact with any Solidity / Vyper contract (even when no ABI is provided)</p>
        <input className="w-3/4 h-10 mt-8 bg-slate-900 border-2 border-cyan-600 rounded-2xl" autoFocus placeholder="Enter contract address" onKeyDown={this.keyDown}></input>
      </div>
    )
  }
}

export default withRouter(Home)