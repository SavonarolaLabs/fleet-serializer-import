import { compile } from "@fleet-sdk/compiler"
import { ErgoAddress, Network, SByte, SColl, SGroupElement, SSigmaProp } from "@fleet-sdk/core"
import { sell } from "./sell_contract/sell"
import { hodl } from "./hodl_contract/hodl"
import { first } from "@fleet-sdk/common"
import { sellFee } from "./sell_fee_contract/sell_fee"

export function compileSellContract() {
    const tree = compile(sell)
    return tree.toAddress(Network.Mainnet).toString()
}

export function compileSellFeeContract() {
    const tree = compile(sellFee)
    return tree.toAddress(Network.Mainnet).toString()
}

export function compileHodlContract(devBase58PK: string): string {
    const devAddr = ErgoAddress.fromBase58(devBase58PK)
    const tree = compile(hodl, {
        map: {
            _contractDevPK: SSigmaProp(SGroupElement(first(devAddr.getPublicKeys()))).toHex(),
            _oraclePoolNFT: SColl(SByte, "011d3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6eda887f").toHex()
        }
    });
    return tree.toAddress(Network.Mainnet).toString()
}
//011d3364de07e5a26f0c4eef0852cddb387039a921b7154ef3cab22c6eda887f //new
//0fb1eca4646950743bc5a8c341c16871a0ad9b4077e3b276bf93855d51a042d1 // old 

//const tree = compile(saleContract
//    , {
//    map: {
//        $oraclePoolNFT: SColl(SByte, stringToBytes("utf8", devPK)),
//        _contractDevPK: SSigmaProp({
//            value: ErgoAddress.fromBase58(hodlerPK).getPublicKeys()[0],
//            type: SigmaTypeCode.GroupElement
//        })
//    }
//}
//)
//return tree.toAddress(Network.Mainnet).toP2SH()
//return tree.toAddress(Network.Mainnet).toString()