import { first } from "@fleet-sdk/common";
import { ErgoAddress, ErgoUnsignedInput, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SInt, SLong, SSigmaProp } from "@fleet-sdk/serializer";
import { getBoxById } from "../box";
import { stringToBytes } from "@scure/base";
import { eip0004Regs, type eip004Regs } from "../eip004utils";
import { getOracleBox } from "../getOracleBox";

export async function receiveHodlBoxTx(buyBox:object, holderBase58PK: string,utxos:Array<any>, height: number,contractBase58PK:string,ergoAmount:bigint,uiBase58PK:string, devBase58PK:string): any{
    //add ,tokenId:string,tokenPrice:bigint
    const myAddr = ErgoAddress.fromBase58(holderBase58PK)
    const uiAddr = ErgoAddress.fromBase58(uiBase58PK) 
    const targetHeight = 1100956
    const targetPrice = 10n
    const oracleBox=await getOracleBox()

    const assets = buyBox.assets
    const feeAsset=assets[0]
    const devFeeAsset = {tokenId:assets[0].tokenId,amount:assets[0].amount/200n}
    const uiFeeAsset = {tokenId:assets[0].tokenId,amount:assets[0].amount/200n}
    const hodlerAsset = {tokenId:assets[0].tokenId,amount:assets[0].amount-assets[0].amount/100n}
    assets[0]=hodlerAsset

    const hodler = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        myAddr
    )
    .addTokens(assets) //<--------------
    .setAdditionalRegisters({
        R4: SColl(SByte, buyBox.boxId).toHex(),
    });
    
    const devFee = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        devBase58PK
    )
    .addTokens(devFeeAsset) //<--------------
    
    const uiFee = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        uiBase58PK
    )
    .addTokens(uiFeeAsset) //<--------------  

//--

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox,...utxos])
        .to([hodler,devFee,uiFee])
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();


        unsignedMintTransaction.dataInputs=[oracleBox]
        

    return unsignedMintTransaction

}