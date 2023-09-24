<script lang="ts">
    import { compileSellContract } from "../erg-contracts/compile";
    import { onMount } from "svelte";
    import { sellTx } from "../erg-contracts/sendToContract";
    import { buyTx, getBox } from "../erg-contracts/buyFromContract";

    let contract:string='';
    let currentTx = ""
    let newBoxId=""
    let newBox = {a:"111"}
    let newBoxText=""
    const tokenId = "89963543c7fa6064cf8e5f567740ff060d4a2b94188d1f267db7ae425a574119";
    const boxId = 'f82d464105672de7ffc90bd142fd1541a76abbc19651e14dcc5e7300fa969938'
    const price = 1_000_000_000n
    const seller = "3Wxa3TmDCRttbDSFxxobU68r9SAPyHcsLwKVwwjGnUDC7yVyYaj3"

    onMount(doStuff);

    async function doStuff() {
        contract = compileSellContract();
        loadBox();
        //"https://testnet.ergoplatform.com/en/addresses/"+
        //sendToken();
        //receiveToken();
    }
    function loadBox(){
        const x=localStorage.getItem("contract_box")
        if (x){
            newBoxText=x
            newBox=JSON.parse(newBoxText)
        }
    }
    function saveBox(){
        localStorage.setItem("contract_box",newBoxText)
    }
    async function receiveToken() {
        await ergoConnector.nautilus.connect();
        const me = await ergo.get_change_address();
        const utxos = await ergo.get_utxos();
        const height = await ergo.get_current_height();
        const tx = await buyTx(newBox, me, tokenId, utxos, height,price,seller);
        //const tx = await getBox(boxId, me, tokenId, utxos, height);
        console.log(tx);
        const signed = await ergo.sign_tx(tx);
        const txId = await ergo.submit_tx(signed);
        console.log(txId)
        currentTx = txId
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
        console.log(signed)
        newBox = signed.outputs[0]
        newBoxText=JSON.stringify(newBox)
        saveBox()
        console.log(txId)
        currentTx = txId
    }

    function copyBoxName(){
        navigator.clipboard.writeText(JSON.stringify(newBox))
    }
    async function pasteBoxName(){
        newBoxText = await navigator.clipboard.readText()
        newBox=JSON.parse(newBoxText)
        saveBox()
    }


</script>
<div>active contract:<a target="_blank" href={`https://testnet.ergoplatform.com/en/addresses/${contract}`}>{contract}</a></div>
<div><button on:click={sendToken}>sendToken</button></div>
<div><button on:click={receiveToken}>receiveToken</button></div>
<div><a target="_blank" href={`https://testnet.ergoplatform.com/en/transactions/${currentTx}`}>{"https://testnet.ergoplatform.com/en/transactions/"+currentTx}</a></div>
<div>new box id = {newBoxId}</div>
<textarea name="" id="111" cols="30" rows="10" bind:value={newBoxText}></textarea>
<button on:click={copyBoxName}>copy</button>
<button on:click={pasteBoxName}>paste</button>