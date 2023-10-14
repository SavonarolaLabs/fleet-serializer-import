import { first } from "@fleet-sdk/common";
import { ErgoAddress, ErgoUnsignedInput, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SInt, SLong, SSigmaProp } from "@fleet-sdk/serializer";
import { getBoxById } from "../box";
import { stringToBytes } from "@scure/base";
import { eip0004Regs, type eip004Regs } from "../eip004utils";
import { getOracleBox } from "../getOracleBox";

export async function mintHodlErg3BoxTx(holderBase58PK: string,utxos:Array<any>, height: number,contractBase58PK:string,assets:any,uiBase58PK:string): any{

    const myAddr = ErgoAddress.fromBase58(holderBase58PK)
    const uiAddr = ErgoAddress.fromBase58(uiBase58PK) 
    const targetHeight = 1112415 // 1,112,361
    const targetPrice = 1502000000n
    const targetRate = 10n**18n/targetPrice
    // 1502000000n // High
    // 998003992n
    // 600000000n // Low 
    const oracleBox=await getOracleBox()

    const tokenRegs: eip004Regs = {
        name: "$6000 Holdbox",
        description: `price: ${targetPrice*10n**9n}, heigth:${targetHeight}, date: 2023-09-29,`,
        sha256: "9ae358259b5e7f0c109f94c5779148d3690bc0968b8b1591d0048513",
        url: "here IPFS LINK to image",
    };

    const contract = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        contractBase58PK
    )
    .addTokens(assets)
    .setAdditionalRegisters({
        R4: SLong(targetRate).toHex(), //665778961n
        R5: SInt(targetHeight).toHex(), // 1101505
        R6: SSigmaProp(SGroupElement(first(myAddr.getPublicKeys()))).toHex(),
        R7: SSigmaProp(SGroupElement(first(uiAddr.getPublicKeys()))).toHex(),
    });

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