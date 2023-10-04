const a = ` 


SELF.R4[SigmaProp].get || 
sigmaProp({       
    val sellerPK                       = SELF.R4[SigmaProp].get.propBytes
    val amount                         = SELF.R5[Long].get
    
    
    val isPaid = {
        if(SELF.R6[Coll[Byte]].isDefined)
        {   
            OUTPUTS(0).tokens(0)._1   == SELF.R6[Coll[Byte]].get &&
            OUTPUTS(0).tokens(0)._2   == amount 
        }
        else
        {
            OUTPUTS(0).value          >= amount
        }
    }
    
    isPaid &&
    OUTPUTS(0).propositionBytes       == sellerPK &&
    OUTPUTS(0).R4[Coll[Byte]].get     == SELF.id
})

`
// R6 -token ID
// R5 -amount
// R4 -seller

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
