export async function getBoxById(boxId: string): Promise<any>{
    const response = await fetch('https://api-testnet.ergoplatform.com/api/v1/boxes/'+boxId);
    const box = await response.json();
    return nautilusBox(box);
}

function nautilusBox(box:any):any{
    box.value = ''+ box.value;
    box.assets?.forEach(a => {
        a.amount = ''+a.amount;
    });
    Object.keys(box.additionalRegisters).forEach(k=>{
        box.additionalRegisters[k] = box.additionalRegisters[k].serializedValue
    })
    return box;
}