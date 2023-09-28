import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SSigmaProp } from "@fleet-sdk/serializer";
import { getBoxById } from "./box";
import { stringToBytes } from "@scure/base";
import { eip0004Regs } from "./mintHodlBox";
import type { eip004Regs } from "./eip004utils";

export async function buyTx(buyBox:object, senderBase58PK: string, tokenId: string,utxos:Array<any>, height: number,tokenPrice:bigint,sellerBase58PK:string,dev:string): any{
    //const buyBox = await getBoxById(buyBoxId);
    const myAddr = ErgoAddress.fromBase58(senderBase58PK)

    const tokenRegs: eip004Regs = {
        name: "$6000 Holdbox",
        description: `price: $0.95, date: 2023-09-29`,
        sha256: "here box image from midjourney SHA256",
        url: "here IPFS LINK to image",
    };

    const seller = new OutputBuilder(
        tokenPrice-tokenPrice/100n,
        sellerBase58PK
    ).mintToken({
        amount: "1",
        name: "$6000 Holdbox",
    }).setAdditionalRegisters(eip0004Regs(tokenRegs));

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