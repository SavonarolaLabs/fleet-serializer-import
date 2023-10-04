import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SGroupElement, SLong, SSigmaProp } from "@fleet-sdk/serializer";

export function sellForErgTx(contract: string, sellerBase58PK: string, utxos: Array<any>, height: number,assets:Array<any>, price: bigint): any{
    const myAddr = ErgoAddress.fromBase58(sellerBase58PK)
    const output = new OutputBuilder(
        SAFE_MIN_BOX_VALUE + RECOMMENDED_MIN_FEE_VALUE,
        contract
    ).addTokens(assets)
    .setAdditionalRegisters({
        R4: SSigmaProp(SGroupElement(first(myAddr.getPublicKeys()))).toHex(),
        R5: SLong(price).toHex(),
    });

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from(utxos)
        .to(output)
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}