import { compile } from "@fleet-sdk/compiler"
import { ErgoAddress, Network, SColl, SGroupElement, SSigmaProp } from "@fleet-sdk/core"
import { sell } from "./sell"
import { hodl } from "./hodl"
import { first } from "@fleet-sdk/common"

export function compileSellContract() {
    const tree = compile(sell)
    return tree.toAddress(Network.Testnet).toString()
}

export function compileHodlContract(devBase58PK: string): string {
    const devAddr = ErgoAddress.fromBase58(devBase58PK)
    const tree = compile(hodl, {
        map: {
            _contractDevPK: SSigmaProp(SGroupElement(first(devAddr.getPublicKeys()))).toHex()
        }
    });
    return tree.toAddress(Network.Testnet).toString()
}

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