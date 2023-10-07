<script lang="ts">
  import {
    compileHodlContract,
    compileSellContract,
  } from "../erg-contracts/compile";
  import { onMount } from "svelte";

  import { sellForErgTx, sellForTokenTx } from "../erg-contracts/sell_contract/sendToContract";
  import { buyForErgTx, buyForTokenTx, getBox } from "../erg-contracts/sell_contract/buyFromContract";

  import { sellTx } from "../erg-contracts/sell_fee_contract/sendToContract_fee";
  import { buyTx } from "../erg-contracts/sell_fee_contract/buyFromContract_fee";
  
  import { cancelTx } from "../erg-contracts/cancelSaleOrder";
  import { mintTokenTx } from "../erg-contracts/mint";
  import { mintHodlBoxTx } from "../erg-contracts/hodl_contract/sendToHodl";
  import { receiveHodlBoxTx } from "../erg-contracts/hodl_contract/receiveHodl";
  import { getContractBoxes } from "../erg-contracts/box";

  let contract: string = "";
  let contractBoxes: any = [];
  let currentTx = "";
  let newBoxId = "";
  let newBox = { a: "111" };
  let newBoxText = "";
  let address = ""

  const additionalTokenId =""
  const price = 1_000_000_000n;
  const tokenId = "0fdb7ff8b37479b6eb7aab38d45af2cfeefabbefdc7eebc0348d25dd65bc2c91"; // mainnet Lambo token

  const currencyAmount = 7n;
  const currencyTokenId = "95823d745f7f768cfea90fd7735d44b87267a52880c56f3743b2674b0980e9e5"; // mainnet turbo-ergo token


  const seller = "9hBdmAbDAcqzL7ZnKjxo39pbEUR5VVzQA7LHWYywdGrZDmf6x5K"; // mainnet
  const dev = "9hBdmAbDAcqzL7ZnKjxo39pbEUR5VVzQA7LHWYywdGrZDmf6x5K";    // mainnet
  const ui = "9fKtqapsSby7JFJKTvx6j4xSUT1nEFEzTrQyqZ1r6fXUrTYa7VK";     // mainnet

  onMount(doStuff);

  async function doStuff() {
    //contract = compileSellContract();
    refreshWallet();
    contract = compileHodlContract(dev);
    loadBox();
    refreshContractBoxes();
    //"https://testnet.ergoplatform.com/en/addresses/"+
    //sellTokens();
    //receiveToken();
  }
  async function refreshWallet(){
    if(window.ergoConnector["nautilus"]?.isConnected){
        address= await ergo.get_change_address();
    }
  }

  function loadBox() {
    const x = localStorage.getItem("contract_box");
    if (x) {
      newBoxText = x;
      newBox = JSON.parse(newBoxText);
    }
  }
  function saveBox() {
    localStorage.setItem("contract_box", newBoxText);
  }

  async function receiveTokenWithFee() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    const tx = await buyTx(
      newBox,
      me,
      tokenId,
      utxos,
      height,
      price,
      seller,
      dev
    );
    //const tx = await getBox(boxId, me, tokenId, utxos, height);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(txId);
    currentTx = txId;
  }

  async function sellTokensWithFee() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    const assets = [
      { tokenId: tokenId, amount: "1" },
    ];
    const tx = sellTx(contract, me, tokenId, utxos, height, dev, assets);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(signed);
    newBox = signed.outputs[0];
    newBoxText = JSON.stringify(newBox);
    saveBox();
    console.log(txId);
    currentTx = txId;
  }

  async function sellTokensForErg() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    const assets = [
      { tokenId: tokenId, amount: "1" },
    ];
    const tx = sellForErgTx(contract, me, utxos, height, assets, price);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(signed);
    newBox = signed.outputs[0];
    newBoxText = JSON.stringify(newBox);
    saveBox();
    console.log(txId);
    currentTx = txId;
  }
  async function receiveTokenForErg() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    const tx = await buyForErgTx(
      newBox,
      me,
      utxos,
      height,
      price,
      seller,
    );
    //const tx = await getBox(boxId, me, tokenId, utxos, height);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(txId);
    currentTx = txId;
  }

  async function sellTokensForToken() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    const assets = [
      { tokenId: tokenId, amount: "1" },
    ];
    const tx = sellForTokenTx(contract, me, utxos, height, assets, currencyAmount,currencyTokenId);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(signed);
    newBox = signed.outputs[0];
    newBoxText = JSON.stringify(newBox);
    saveBox();
    console.log(txId);
    currentTx = txId;
  }
  async function receiveTokenForToken() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    const tx = await buyForTokenTx(
      newBox,
      me,
      utxos,
      height,
      currencyAmount,
      seller,
      currencyTokenId
    );
    //const tx = await getBox(boxId, me, tokenId, utxos, height);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(txId);
    currentTx = txId;
  }

  async function cancelTokenSell() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    const tx = await cancelTx(newBox, me, height);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(signed);
    newBox = signed.outputs[0];
    newBoxText = JSON.stringify(newBox);
    saveBox();
    console.log(txId);
    currentTx = txId;
  }

  async function mintToken() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    const tokenName = "turbo ergo";
    const amount = 1000n;
    const tx = await mintTokenTx(tokenName, amount, me, utxos, height);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(signed);
    console.log(txId);
    currentTx = txId;
  }

  async function mintHodlBox() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    //const tokenName = "turbo ergo";
    const amount = 3300000n;
    const tx = await mintHodlBoxTx(me, utxos, height, contract, amount, ui);
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(signed);
    newBox = signed.outputs[0];
    newBoxText = JSON.stringify(newBox);
    saveBox();
    console.log(txId);
    currentTx = txId;
  }

  //receiveHodlBoxTx
  async function receiveHodlBox() {
    await ergoConnector.nautilus.connect();
    const me = await ergo.get_change_address();
    const utxos = await ergo.get_utxos();
    const height = await ergo.get_current_height();
    //const tokenName = "turbo ergo";
    const amount = 3300000n;
    const tx = await receiveHodlBoxTx(
      newBox,
      me,
      utxos,
      height,
      contract,
      amount,
      ui,
      dev
    );
    console.log(tx);
    const signed = await ergo.sign_tx(tx);
    const txId = await ergo.submit_tx(signed);
    console.log(signed);
    newBox = signed.outputs[0];
    newBoxText = JSON.stringify(newBox);
    saveBox();
    console.log(txId);
    currentTx = txId;
  }

  function copyBoxName() {
    navigator.clipboard.writeText(JSON.stringify(newBox));
  }
  async function pasteBoxName() {
    newBoxText = await navigator.clipboard.readText();
    newBox = JSON.parse(newBoxText);
    saveBox();
  }

  async function refreshContractBoxes() {
    contractBoxes = await getContractBoxes(contract);
  }
</script>

<div>
    active wallet: {address}
  </div>
<div>
  active contract:<a
    target="_blank"
    href={`https://testnet.ergoplatform.com/en/addresses/${contract}`}
    >{contract}</a
  >
</div>
<div><button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
   on:click={sellTokensWithFee}>sell Tokens With Fee</button>
   <button class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
   on:click={sellTokensForErg}>sell Tokens for ERG - No Fee</button>
   <button class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
   on:click={sellTokensForToken}>sell Tokens for Token - No Fee</button>
</div>
<div><button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
   on:click={receiveTokenWithFee}>receive Token With Fee </button>
   <button class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
   on:click={receiveTokenForErg}>receive Token for ERG- No Fee</button>
   <button class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
   on:click={receiveTokenForToken}>receive Token for Token- No Fee</button>
</div>
<div><button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
   on:click={cancelTokenSell}>cancelSellToken</button></div>

<div>
  <a
    target="_blank"
    href={`https://ergoplatform.com/en/transactions/${currentTx}`}
    >{"https://ergoplatform.com/en/transactions/" + currentTx}</a
  >
</div>
<div>new box id = {newBoxId}</div>
<textarea name="" id="111" cols="30" rows="10" bind:value={newBoxText} />
<button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
 on:click={copyBoxName}>copy</button>
<button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
 on:click={pasteBoxName}>paste</button>
<div><button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
   on:click={mintToken}>mint token</button></div>
<div />
<div><button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
   on:click={mintHodlBox}>mint hodl box</button></div>
<div />
<div><button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
   on:click={receiveHodlBox}>receive hodl box</button></div>

<div class="mt-4">
  <div><button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
     on:click={refreshContractBoxes}>refresh boxes</button></div>
  <div>{contract}</div>
  {#if contractBoxes.length < 1}
    <div>contract has no boxes</div>
  {:else}
    <div class="flex flex-col gap-1">
      {#each contractBoxes as box}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          on:click={() => {
            newBox = box;
            newBoxText = JSON.stringify(newBox);
          }}
          class="cursor-pointer"
        >
          <div>boxId: {box.boxId}</div>
          <div>{box.value} ERG</div>
        </div>
      {/each}
    </div>
  {/if}
</div>
