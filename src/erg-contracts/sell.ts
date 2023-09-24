const a = `
SELF.R4[SigmaProp].get || 
sigmaProp({
    val priceNanoErg     	= SELF.R5[Long].get         
    val feeAddress			= SELF.R6[SigmaProp].get.propBytes
    val feeDenom 			= 100000L
    val devFee   			= 1000L
    val fee  			    = (priceNanoErg.toBigInt * devFee.toBigInt) / feeDenom.toBigInt
    val feePaid				= (fee == 0) || (OUTPUTS(1).value >= fee && OUTPUTS(1).propositionBytes == feeAddress)
    
    feePaid && 
    OUTPUTS(0).value-fee>=SELF.R5[Long].get  &&
    OUTPUTS(0).propositionBytes==SELF.R4[SigmaProp].get.propBytes &&
    OUTPUTS(0).R4[Coll[Byte]].get==SELF.id
})

`
//
//val sellerAddress		= SELF.R6[Coll[Byte]].get   // seller receive address
//val feeAddress			= SELF.R7[Coll[Byte]].get   // ui Fee receive address
// fee?????
// ui fee 
//val feeDenom = 100000L
//val devFee   = 500L 
//SELF.R4[SigmaProp].get || 
/*const b = `{
    val holderPK = SELF.R4[SigmaProp].get
    holderPK  || 
    (holderPK.propBytes == OUTPUTS(0).propositionBytes)
}`*/
// repaymentBox.R4[Coll[Byte]].get == SELF.id,

export const sell = a;
