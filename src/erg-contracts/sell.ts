const a = `
SELF.R4[SigmaProp].get || 
sigmaProp({       
    val fee  	= (SELF.R5[Long].get.toBigInt * (1000L).toBigInt) / (100000L).toBigInt
    val feePaid	= (fee == 0) || (OUTPUTS(1).value >= fee && OUTPUTS(1).propositionBytes == SELF.R6[SigmaProp].get.propBytes)
    
    feePaid && 
    OUTPUTS(0).value               >=  SELF.R5[Long].get - fee  &&
    OUTPUTS(0).propositionBytes    ==  SELF.R4[SigmaProp].get.propBytes &&
    OUTPUTS(0).R4[Coll[Byte]].get  ==  SELF.id
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
