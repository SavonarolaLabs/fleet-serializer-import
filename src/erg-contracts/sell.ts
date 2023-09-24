const a = `{
    val holderPK = SELF.R4[SigmaProp].get
    holderPK  || 
    (holderPK.propBytes == OUTPUTS(0).propositionBytes)
}`
//const b = `SELF.R4[SigmaProp].get`
export const sell = a;
