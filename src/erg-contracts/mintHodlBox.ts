import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SSigmaProp } from "@fleet-sdk/serializer";
import { getBoxById } from "./box";
import { stringToBytes } from "@scure/base";

export function eip0004Regs(o){
    return eip0004ArtworkRegisters(o.name, o.description, o.sha256, o.url)
}

export function eip0004ArtworkRegisters(name, description, sha256, url){
    return {
        R4: SConstant(SColl(SByte, stringToBytes("utf8", name))),
        R5: SConstant(SColl(SByte, stringToBytes("utf8", description))),
        R6: SConstant(SColl(SByte, stringToBytes("utf8", "0"))),
        R7: "0e020101",
        R8: SConstant(SColl(SByte, stringToBytes("hex", sha256))),
        R9: SConstant(SColl(SByte, stringToBytes("utf8", url)))
    }
}







export async function buyTx(buyBox:object, senderBase58PK: string, tokenId: string,utxos:Array<any>, height: number,tokenPrice:bigint,sellerBase58PK:string,dev:string): any{
    //const buyBox = await getBoxById(buyBoxId);
    const myAddr = ErgoAddress.fromBase58(senderBase58PK)

    const seller = new OutputBuilder(
        tokenPrice-tokenPrice/100n,
        sellerBase58PK
    )
    .setAdditionalRegisters({
        R4: SColl(SByte, buyBox.boxId).toHex(),
    });

    const fee = new OutputBuilder(
        tokenPrice/100n,
        dev
    )

    const output = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        senderBase58PK
    ).addTokens(buyBox.assets)

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox,...utxos ])
        .to([seller,fee,output])
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}

export async function getBox(buyBoxId: string, senderBase58PK: string, tokenId: string, height: number): any{
    const buyBox = await getBoxById(buyBoxId);
    const myAddr = ErgoAddress.fromBase58(senderBase58PK)

    const output = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        senderBase58PK
    );

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox])
        .to(output)
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}