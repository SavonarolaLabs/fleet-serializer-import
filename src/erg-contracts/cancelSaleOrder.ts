import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SSigmaProp } from "@fleet-sdk/serializer";
import { stringToBytes } from "@scure/base";
import { getBoxById } from "./box";

export async function cancelTx(buyBox:object, sellerBase58PK: string, height: number): any{
    const myAddr = ErgoAddress.fromBase58(sellerBase58PK)
    const output = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        sellerBase58PK
    ).addTokens(buyBox.assets)
    .setAdditionalRegisters({
        R4: SColl(SByte, stringToBytes("utf8", buyBox.id)).toHex(),
    });

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox])
        .to(output)
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}