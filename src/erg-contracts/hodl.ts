const a = `
{
    // Constants
    // _contractDevPK
    //val oraclePoolNFT = "0fb1eca4646950743bc5a8c341c16871a0ad9b4077e3b276bf93855d51a042d1"
    
    // Context vars set by the UI developer building the HODLBOX mint transaction
    val hodlTargetRate : Long        = SELF.R4[Long].get
    val maxHeight : Int              = SELF.R5[Int].get
    val hodlerPK : SigmaProp         = SELF.R6[SigmaProp].get
    val optUIFeePK : SigmaProp         = SELF.R7[SigmaProp].get
    
    val totalLockedNanoErg : Long    = SELF.value
    
    val fees: Coll[(SigmaProp, BigInt)] = {
        val feeDenom : Long = 100000L
        val devFee  : Long  = 500L         // 0.5%
        // If ui fee is defined, then we add an additional 0.5% fee
        if(optUIFeePK.isDefined){
            val uiFee : Long = 500L        // 0.5%

            Coll(
                 (_contractDevPK, (devFee.toBigInt * totalLockedNanoErg.toBigInt) / feeDenom.toBigInt),
                 (optUIFeePK.get, (uiFee.toBigInt * totalLockedNanoErg.toBigInt) / feeDenom.toBigInt)
            )
        }else{
            Coll( (_contractDevPK, (devFee.toBigInt * totalLockedNanoErg.toBigInt) / feeDenom.toBigInt) )
        }
    }

    // Ensure that correct fee output boxes exist
    val feesPaid : Boolean = {
        val devFeesPaid: Boolean = {
            if(fees(0)._2 > 0){ // Dev fee is greater than 0
                val devOutput : Box   = OUTPUTS(1)
                allOf(
                    Coll(
                        devOutput.propositionBytes   == fees(0)._1.propBytes,
                        devOutput.value.toBigInt     == fees(0)._2
                    )
                )
            }else{
                true // do nothing if dev fee doesn't add up greater than 0, prevents errors on low value bonds
            }
        }

        val uiFeesPaid : Boolean = {
            if(optUIFeePK.isDefined){
                if(fees(1)._2 > 0){ // UI fee is greater than 0
                    val uiOutput : Box    = OUTPUTS(2)
                    allOf(
                        Coll(
                            uiOutput.propositionBytes   == fees(1)._1.propBytes,
                            uiOutput.value.toBigInt     == fees(1)._2
                        )
                    )
                }else{
                    true // do nothing if ui fee doesn't end up greater than 0, prevents errors on low value bonds
                }
            }else{
                true // if ui fee isn't defined, then default to true.
            }
        }
        devFeesPaid && uiFeesPaid
    }

    val feesTotal : Long = {
        if(optUIFeePK.isDefined){
            fees(0)._2 + fees(1)._2
        }else{
            fees(0)._2
        }
    }

    val repaymentNanoErg : Long = totalLockedNanoErg - feesTotal

    val fundsReturned : Boolean = {
        OUTPUTS(0).propositionBytes == hodlerPK.propBytes && 
        OUTPUTS(0).value == repaymentNanoErg
    }

    val maxHeightReached : Boolean = {
        maxHeight <= HEIGHT
    }

    val priceTargetReached : Boolean = {
        if (CONTEXT.dataInputs.size > 0) {
            // validate Oracle box
            val oracleBox : Box = CONTEXT.dataInputs(0)
            val currentRate : Long = oracleBox.R4[Long].get
            val oracleHeight: Long = oracleBox.R5[Int].get

            val validDataInput: Boolean = HEIGHT <= oracleHeight + 30 && oracleBox.tokens(0)._1 == _oraclePoolNFT

            // check if the price reached target
            val targetPriceReached: Boolean = currentRate >= hodlTargetRate

            validDataInput && targetPriceReached
        } else {
            false
        }
    }

    if(priceTargetReached || maxHeightReached){
        sigmaProp(fundsReturned && feesPaid)
    } else {
        sigmaProp(false)
    }
}

`

export const hodl = a;
