const a = `
SELF.R4[SigmaProp].get || 
sigmaProp (
    OUTPUTS(0).value<=SELF.R5[Long].get && 
    OUTPUTS(0).propositionBytes==SELF.R4[SigmaProp].get.propBytes &&
    OUTPUTS(0).R4[Coll[Byte]].get==SELF.id
)
`
//SELF.R4[SigmaProp].get || 
/*const b = `{
    val holderPK = SELF.R4[SigmaProp].get
    holderPK  || 
    (holderPK.propBytes == OUTPUTS(0).propositionBytes)
}`*/
// repaymentBox.R4[Coll[Byte]].get == SELF.id,

export const sell = a;
