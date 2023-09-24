import { compile } from "@fleet-sdk/compiler"
import { Network } from "@fleet-sdk/core"
import { sell } from "./sell"

export function compileSellContract(){
    const tree = compile(sell)
    return tree.toAddress(Network.Testnet).toString()
}

//const tree = compile(saleContract
//    , {
//    map: {
//        $oraclePoolNFT: SColl(SByte, stringToBytes("utf8", devPK)),
//        $contractDevPK: SSigmaProp({
//            value: ErgoAddress.fromBase58(hodlerPK).getPublicKeys()[0],
//            type: SigmaTypeCode.GroupElement
//        })
//    }
//}
//)
//return tree.toAddress(Network.Mainnet).toP2SH()
//return tree.toAddress(Network.Mainnet).toString()