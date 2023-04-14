import { eventHandler } from './methods/EventHandler'
import { NFT_MANAGER_ADDRESS, provider } from './constants/index'
import { ethers } from 'ethers'

import * as NFT_MANAGER from './ABI/Nonfungiblepositionmanager.json'

const NFPM = new ethers.Contract(NFT_MANAGER_ADDRESS, NFT_MANAGER.abi, provider)

const decreaseLiquidityListener = async (blockNumber: number) => {
    try {
            const decreaseLiquidityEvent: any = await NFPM.queryFilter(
                'DecreaseLiquidity',
                blockNumber - 1,
                blockNumber                  
            )
            for(const event of decreaseLiquidityEvent){
                await eventHandler(
                    event.event,
                    event.args.tokenId._hex,
                    event.blockNumber,
                    event.args.amount0._hex,
                    event.args.amount1._hex,
                    event.transactionHash,
                    )
                }
    } catch (error: any) {
        console.log(error.message)
    }
}

/**
 * 
 * @param {*} blockNumber 
 */

const increaseLiquidityListener = async (blockNumber: number) => {
    try {
            const increaseLiquidityEvent: any = await NFPM.queryFilter(
                'IncreaseLiquidity',
                blockNumber - 1,
                blockNumber   
            )
            //CALL LAMBDA
            for(const event of increaseLiquidityEvent){
                    await eventHandler(
                        event.event,
                        event.args.tokenId._hex,
                        event.blockNumber,
                        event.args.amount0._hex,
                        event.args.amount1._hex,    
                        event.transactionHash,
                        )
                }
            } catch (error: any) {
                console.log(error.message)
            }
}


const forLoop = async () => {
    const blocks = [
        227814,
        227868,
        227893,
        228311,
        228318,
        228377
    ]
    for(const block of blocks){
        await decreaseLiquidityListener(block)
        await increaseLiquidityListener(block)
        console.log(block)
    }
}

forLoop()