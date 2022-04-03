var polyline = require('google-polyline')
const geolib = require('geolib')


const decode=(encodedPoints)=>{
    let decoded = polyline.decode(encodedPoints)
    console.log(decoded)
    return decoded
}
decode('xz`@ss{yEtBnBzEdBpCgHfDmIZSfBPvFrCj_Av`@`aAfk@pc@jTxBNvGwO|Pac@tx@etBrr@ufBzbBsiEdHq|@xCwl@~ImaBfg@odCfb@coBzF_JrQeMjd@iYdQmUlDaNT{PrAsNrUyp@tp@mlBvBaF`Tsz@_GeXmNab@eCuFyIga@_Gk\\Ww@}@cJhCeFdJ{Lp@wMgKucAMyRfIwc@rk@eiBld@cxAnMm`@tLsFnr@k@pa@aFnHeGfHkMbT}[bZ_^db@a`@zg@ob@n\\}^v[_e@pLeXtXwdAxIu_@~Owd@d`@mh@v^ef@vU}g@lTe]f[_\\fb@ci@xVwWhUmPde@mTva@cNpgAw`@fv@u[jg@oL~o@w[rc@}Tra@qWva@eKfWaOzY{Wtk@m`@`d@sh@dTcXjT_Lj`@kOjS_MjXga@fOeObTqIv]gLnb@{Tly@mi@vNgIjU{F~m@aRv]gVvX{\\`a@g\\vb@}O|WqJz^oStr@}m@ne@{\\xy@cc@~VkJpu@_Ldu@eQfp@sWjp@wMbmAHv{BtE|k@_Gbe@}Qta@s_@lVkb@l`AwgBzVat@~JwRbVyWrf@oXn_@wVn`@{b@`YcRb\\{Jbo@eTft@qd@zp@mu@xf@os@la@mt@|Sqi@jHuZzGsYrOw_@jKqM|T_Prg@uPf`@}TvkAs`AhoAmw@f{@mo@jc@mUv\\cHzRrAvUhHx`@zKpc@cC~[G|_@mDnOyJb{@}v@dQku@bNy\\j]kf@fDoJ`EwVtIaWlPuP~a@g[fv@as@~\\{TjVkHnu@qKvj@iWjSoM|PuD|QiExXoQbXuRxHeAhV{AhNyFlT]lp@`Tna@\\lj@gOt]sLt`@kCtX~Abp@nNhUtHlh@vEvRbHtPxAzSbG~Su@xd@oOrp@aLbv@mVn]m@`VbCbf@bIne@LxZjBrL}A|{@kTfl@~@zUGjRnDjWbDf[mDntAcDdoAeVfxAuNj_DmY|QqCbXgKbQyGp_@mN|b@{Ux_AmYbc@sMdJaHpKyJlVmCfg@_E|OkElIcM`OkGpMaQzNkNt_@}Pz[gYtj@y|@xFuQtX}hAfGcm@m@_XsAs[vGyXfGmLnEmRhBsr@sCsyBkC_]aNk^kGah@u@o_@~Com@pF{u@zE_ShMiKlNwLna@q]~I}PmEqLsEkB{FcAaG{GaK_IjF_U}Aae@eJmj@m`@ol@yPwc@a@{Se@kJsFaLgc@ee@ke@ud@sReLm`@kMkGuFoCcB_BnAmBqBhBaArEUv@Y|@Hl@CoFeJqHiK}@?iBh@yFcJzAc@fCrB')


module.exports = decode

