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

    const buyer = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        myAddr
    ).addTokens(boxOnContract.assets.map(a=>{
        a.amount=+a.amount+(+utxos.flatMap(u=>u.assets.filter(aa=>aa.tokenId==a.tokenId)).map(a=>a.amount).reduce((s,am)=>+am+s,0))
        return a
    }))

    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox,...utxos ])
        .to([seller,fee,buyer])
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}