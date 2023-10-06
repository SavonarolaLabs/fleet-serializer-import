import { first } from "@fleet-sdk/common";
import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, SAFE_MIN_BOX_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl, SGroupElement, SSigmaProp } from "@fleet-sdk/serializer";
import { getBoxById } from "../box";
import { stringToBytes } from "@scure/base";

export async function buyForErgTx(buyBox:object, senderBase58PK: string,utxos:Array<any>, height: number,price:bigint,sellerBase58PK:string): any{

    const myAddr = ErgoAddress.fromBase58(senderBase58PK)

    const seller = new OutputBuilder(
        price,
        sellerBase58PK
    )
    .setAdditionalRegisters({
        R4: SColl(SByte, buyBox.boxId).toHex(),
    });

    
    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox,...utxos ])
        .to([seller])
        .sendChangeTo(myAddr)
        .payFee(RECOMMENDED_MIN_FEE_VALUE * 2n)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction
}

export async function buyForTokenTx(buyBox:object, buyerBase58PK: string,utxos:Array<any>, height: number,currencyAmount:bigint,sellerBase58PK:string,currencyTokenId: string): any{

    
    let boxOnContract = JSON.parse(JSON.stringify(buyBox))
    console.log(boxOnContract)

    const myAddr = ErgoAddress.fromBase58(buyerBase58PK)

    const seller = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        sellerBase58PK
    ).addTokens({
        tokenId: currencyTokenId, amount: currencyAmount
    })
    .setAdditionalRegisters({
        R4: SColl(SByte, boxOnContract.boxId).toHex(),
    });


    const buyer = new OutputBuilder(
        SAFE_MIN_BOX_VALUE,
        myAddr
    ).addTokens(boxOnContract.assets.map(a=>{
        a.amount=+a.amount+(+utxos.flatMap(u=>u.assets.filter(aa=>aa.tokenId==a.tokenId)).map(a=>a.amount).reduce((s,am)=>+am+s,0))
        return a
    }))
    
    
    const unsignedMintTransaction = new TransactionBuilder(height)
        .from([buyBox,...utxos ])
        .to([seller,buyer])
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