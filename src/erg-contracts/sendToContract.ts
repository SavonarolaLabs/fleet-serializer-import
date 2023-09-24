import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SGroupElement, SSigmaProp } from "@fleet-sdk/serializer";

export function sellTx(contract: string, senderBase58PK: string, tokenId: string, utxos: Array<any>, height: number): any{
    const myAddr = ErgoAddress.fromBase58(senderBase58PK)

    const output = new OutputBuilder(
        SAFE_MIN_BOX_VALUE + RECOMMENDED_MIN_FEE_VALUE * 2n,
        contract
    ).addTokens([{ 
        tokenId: tokenId, 
        amount: "1" 
    }]).setAdditionalRegisters({
        R4: SSigmaProp(SGroupElement(first(myAddr.getPublicKeys()))).toHex(),
    });

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from(utxos)
        .to(output)
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}