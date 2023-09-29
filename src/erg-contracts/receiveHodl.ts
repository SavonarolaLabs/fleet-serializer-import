import { first } from "@fleet-sdk/common";
import { ErgoAddress, ErgoUnsignedInput, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SInt, SLong, SSigmaProp } from "@fleet-sdk/serializer";
import { getBoxById } from "./box";
import { stringToBytes } from "@scure/base";
import { eip0004Regs, type eip004Regs } from "./eip004utils";
import { getOracleBox } from "./getOracleBox";

export async function receiveHodlBoxTx(buyBox:object, holderBase58PK: string,utxos:Array<any>, height: number,contractBase58PK:string,ergoAmount:bigint,uiBase58PK:string, devBase58PK:string): any{
    //add ,tokenId:string,tokenPrice:bigint
    const myAddr = ErgoAddress.fromBase58(holderBase58PK)
    const uiAddr = ErgoAddress.fromBase58(uiBase58PK) 
    const targetHeight = 1100956
    const targetPrice = 10n
    const oracleBox=await getOracleBox()

    const output = new OutputBuilder(
        BigInt(buyBox.value)-ergoAmount/100n,
        myAddr
    ).addTokens(buyBox.assets)
    
    //27720/0.05 = 5 544 000

    const devFee = new OutputBuilder(
        SAFE_MIN_BOX_VALUE>ergoAmount/200n?SAFE_MIN_BOX_VALUE:ergoAmount/200n,
        devBase58PK
    )
    const uiFee = new OutputBuilder(
        SAFE_MIN_BOX_VALUE>ergoAmount/200n?SAFE_MIN_BOX_VALUE:ergoAmount/200n,
        uiBase58PK
    )


    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox,...utxos])
        .to([output,devFee,uiFee])
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();


        unsignedMintTransaction.dataInputs=[oracleBox]
        

    return unsignedMintTransaction

}