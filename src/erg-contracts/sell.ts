const a = `
SELF.R4[SigmaProp].get || sigmaProp (SELF.R5[Long].get>=OUTPUTS(0).value && 
    SELF.R4[SigmaProp].get.propBytes==OUTPUTS(0).propositionBytes)
`
//SELF.R4[SigmaProp].get || 
/*const b = `{
    val holderPK = SELF.R4[SigmaProp].get
    holderPK  || 
    (holderPK.propBytes == OUTPUTS(0).propositionBytes)
}`*/
export const sell = a;
