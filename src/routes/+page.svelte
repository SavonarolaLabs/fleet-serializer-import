<script lang="ts">
    import { compileSellContract } from "../erg-contracts/compile";
    import { onMount } from "svelte";
    import { sellTx } from "../erg-contracts/sendToContract";
    import { buyTx, getBox } from "../erg-contracts/buyFromContract";

    let contract:string='';
    const tokenId = "89963543c7fa6064cf8e5f567740ff060d4a2b94188d1f267db7ae425a574119";
    const boxId = '71e768dd2278e5acfb45560aeff26ae5cef51cd9df0bd490bce57b349f0bedde'
    //const boxId = 'a8fea293382d8a4a2ed4aa2f355c3ed6e4705a3ff0ddf69f011aa7d277ee4c36'

    onMount(doStuff);

    async function doStuff() {
        contract = compileSellContract();
        //"https://testnet.ergoplatform.com/en/addresses/"+
        //sendToken();
        //receiveToken();
    }
    async function receiveToken() {
        await ergoConnector.nautilus.connect();
        const me = await ergo.get_change_address();
        const utxos = await ergo.get_utxos();
        const height = await ergo.get_current_height();
        const tx = await buyTx(boxId, me, tokenId, utxos, height);
        //const tx = await getBox(boxId, me, tokenId, utxos, height);
        console.log(tx);
        const signed = await ergo.sign_tx(tx);
        const txId = await ergo.submit_tx(signed);
        console.log(txId)
    }
    async function sendToken() {
        await ergoConnector.nautilus.connect();
        const me = await ergo.get_change_address();
        const utxos = await ergo.get_utxos();
        const height = await ergo.get_current_height();
        const tx = sellTx(contract, me, tokenId, utxos, height);
        console.log(tx);
        const signed = await ergo.sign_tx(tx);
        const txId = await ergo.submit_tx(signed);
        console.log(txId)
    }
</script>

<a target="_blank" href={`https://testnet.ergoplatform.com/en/addresses/${contract}`}>{"https://testnet.ergoplatform.com/en/addresses/"+contract}</a>
