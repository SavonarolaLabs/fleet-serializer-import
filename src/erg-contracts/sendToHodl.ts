import { first } from "@fleet-sdk/common";
import { ErgoAddress, ErgoUnsignedInput, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SInt, SLong, SSigmaProp } from "@fleet-sdk/serializer";
import { getBoxById } from "./box";
import { stringToBytes } from "@scure/base";
import { eip0004Regs, type eip004Regs } from "./eip004utils";

export async function mintHodlBoxTx(holderBase58PK: string,utxos:Array<any>, height: number,contractBase58PK:string,ergoAmount:bigint,uiBase58PK:string): any{
    //add ,tokenId:string,tokenPrice:bigint
    const myAddr = ErgoAddress.fromBase58(holderBase58PK)
    const uiAddr = ErgoAddress.fromBase58(uiBase58PK) 
    const targetHeight = 1100956n
    const targetPrice = 10n

    const tokenRegs: eip004Regs = {
        name: "$6000 Holdbox",
        description: `price: $0.95, date: 2023-09-29`,
        sha256: "9ae358259b5e7f0c109f94c5779148d3690bc0968b8b1591d0048513",
        url: "here IPFS LINK to image",
    };

    const contract = new OutputBuilder(
        ergoAmount,
        contractBase58PK
    ).setAdditionalRegisters({
        R4: SLong(targetPrice).toHex(), //CHECK
        R5: SLong(targetHeight).toHex(), //1100956
        R6: SSigmaProp(SGroupElement(first(myAddr.getPublicKeys()))).toHex(),
        R7: SSigmaProp(SGroupElement(first(uiAddr.getPublicKeys()))).toHex(),
    });

  


    //---------------------Context to particular box--------------------------- 
    // const inputWithContext = new ErgoUnsignedInput(fee.box).setContextVars({  
    //      0: SSigmaProp(SGroupElement(first(myAddr.getPublicKeys()))).toHex()
    //    });
    //-------------------------------------------------------------------------
    // inputWithContext.setContextVars({ 0: "0402", 1: "0580c0fc82aa02" });

    // if inside Tx 
    // addInputs(
    //     new ErgoUnsignedInput(orderBox).setContextVars({
    //         0: SSigmaProp(SGroupElement(first(params.uiImplementor.getPublicKeys()))).toHex()
    //     })
    // );



    const nft = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        holderBase58PK
    ).mintToken({
        amount: "1",
        name: "$6000 Holdbox",
    }).setAdditionalRegisters(eip0004Regs(tokenRegs));


    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([...utxos])
        .to([contract,nft])
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction

}