import { NextRouter, withRouter } from "next/router"
import Head from "next/head"
import Image from "next/image"
import React from "react"
import GITHUB from "../public/github.png"

class Home extends React.Component<{router: NextRouter}> {
  keyDown = (e: React.KeyboardEvent) => {
    if(e.key == "Enter") this.props.router.push("/" + (e.target as HTMLInputElement).value)
  }

  render() {
    return (
      <div>
        <div className="absolute w-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <Head>
            <title>Etheract</title>
          </Head>

          <p className="text-4xl mb-3">Etheract</p>
          <p>Quickly interact with any Solidity / Vyper contract (even when no ABI is provided)</p>
          <input className="w-3/4 h-10 mt-8 bg-slate-900 border-2 border-cyan-600 rounded-2xl focus:shadow-[0px_0px_30px_0px_#0890b2] transition-shadow duration-300" autoFocus placeholder="Enter contract address" onKeyDown={this.keyDown}/>
        </div>

        <div className="absolute w-full bottom-4 flex justify-center">
          <a className="flex items-center gap-2" href="https://github.com/MatheoGrivault/Etheract" target="_blank" rel="noreferrer">
            <Image className="w-8 h-8" src={GITHUB} alt=""/>
            GitHub
          </a>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)