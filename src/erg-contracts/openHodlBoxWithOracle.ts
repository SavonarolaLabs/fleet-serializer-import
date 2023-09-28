const a = `
SELF.R4[SigmaProp].get || 
sigmaProp({    
    HEIGHT


    val fee  	= (SELF.R5[Long].get.toBigInt * (1000L).toBigInt) / (100000L).toBigInt
    val feePaid	= (fee == 0) || (OUTPUTS(1).value >= fee && OUTPUTS(1).propositionBytes == SELF.R6[SigmaProp].get.propBytes)
    

    
    feePaid && 
    OUTPUTS(0).value               >=  SELF.R5[Long].get - fee  &&
    OUTPUTS(0).propositionBytes    ==  SELF.R4[SigmaProp].get.propBytes &&
    OUTPUTS(0).R4[Coll[Byte]].get  ==  SELF.id
})
`

// val validSellOption: Boolean = if (!isFrozen && INPUTS.size == 2 && CONTEXT.dataInputs.size > 0) {
//     // Oracle Info
//     val oracleBox: Box = CONTEXT.dataInputs(0)
//     val oraclePrice: Long = oracleBox.R4[Long].get // nanoerg per token
//     val oracleHeight: Long = oracleBox.R5[Int].get
//     val validOracle: Boolean = oracleBox.tokens(0)._1 == OracleTokenId && HEIGHT <= oracleHeight + 30





export const sell = a;
