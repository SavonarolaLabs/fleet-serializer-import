import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SSigmaProp } from "@fleet-sdk/serializer";
import { getBoxById } from "../box";
import { stringToBytes } from "@scure/base";

export async function buyForErgTx(buyBox:object, senderBase58PK: string,utxos:Array<any>, height: number,price:bigint,sellerBase58PK:string): any{
    //const buyBox = await getBoxById(buyBoxId);
    const myAddr = ErgoAddress.fromBase58(senderBase58PK)

    const seller = new OutputBuilder(
        price,
        sellerBase58PK
    )
    .setAdditionalRegisters({
        R4: SColl(SByte, buyBox.boxId).toHex(),
    });


    const output = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        senderBase58PK
    ).addTokens(buyBox.assets)

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox,...utxos ])
        .to([seller,output])
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