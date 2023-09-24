import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SSigmaProp } from "@fleet-sdk/serializer";
import { stringToBytes } from "@scure/base";
import { getBoxById } from "./box";

export async function mintTokenTx(tokenName:string,amount:bigint,minterAddress: string,utxos: Array<any>, height: number): any{
    const myAddr = ErgoAddress.fromBase58(minterAddress)

    const output = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        minterAddress
    ).mintToken({
        amount: amount,
        name: tokenName,
    })

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from(utxos)
        .to(output)
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}