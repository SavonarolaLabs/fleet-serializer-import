import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl} from "@fleet-sdk/serializer";

export async function buyTx(buyBox:any, senderBase58PK: string, utxos:Array<any>, height: number,tokenPrice:bigint,sellerBase58PK:string,devBase58PK:string): any{
    
    const myAddr = ErgoAddress.fromBase58(senderBase58PK)
    
    let boxOnContract = JSON.parse(JSON.stringify(buyBox))
    console.log(boxOnContract)

    const seller = new OutputBuilder(
        tokenPrice-tokenPrice/100n,
        sellerBase58PK
    )
    .setAdditionalRegisters({
        R4: SColl(SByte, buyBox.boxId).toHex(),
    });

    const fee = new OutputBuilder(
        tokenPrice/100n,
        devBase58PK
    )



    const unsignedMintTransaction = new TransactionBuilder(height)
        .configureSelector((selector) => selector.ensureInclusion(buyBox.boxId))
        .from([buyBox,...utxos ])
        .to([seller,fee])
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}