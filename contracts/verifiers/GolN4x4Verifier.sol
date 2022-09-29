// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/


pragma solidity >=0.7.0 <0.9.0;

contract PlonkVerifier {
    
    uint32 constant n =   2048;
    uint16 constant nPublic =  16;
    uint16 constant nLagrange = 16;
    
    uint256 constant Qmx = 5679470373243715925019146085688485598366376624818024500688865653196734198021;
    uint256 constant Qmy = 20072437833698012687029099704179570860093594392989792138523502362479293107441;
    uint256 constant Qlx = 8104412246048717462645083916873236763254586239784792063288975580640254430963;
    uint256 constant Qly = 20675892557910619146353464087431599460007342140314865345080539686764982585156;
    uint256 constant Qrx = 1881911582828658998768244948452303362288584973419439373699396384917220739873;
    uint256 constant Qry = 6680989392234436151168607425824241767656668115274955136859257650458157547548;
    uint256 constant Qox = 6804728762106989950609893069583561004906341747110124725409931942359663626902;
    uint256 constant Qoy = 19000647207610869166020027389987092557332692280770255039375221495124493013231;
    uint256 constant Qcx = 14724114572797370355166153001531425729582164155485425211297875931276751832406;
    uint256 constant Qcy = 20863837674175377107053665497822753009060851356274895985248182669643710654205;
    uint256 constant S1x = 110509437033252255289951955209465591760056630910187224765454193119453720074;
    uint256 constant S1y = 19467872781810749353204457556714743778476759700019083032370395958660569129594;
    uint256 constant S2x = 18534081812322179750931673646540342845071578307254106418922667929667659657340;
    uint256 constant S2y = 19116087831776639948017869788486725014461878364578653560333962394005447178122;
    uint256 constant S3x = 12051448201442072493877906669716294045281843550062039365723572102680474226933;
    uint256 constant S3y = 11941733517374516624574587550359548522238224106038678569020942309924792564983;
    uint256 constant k1 = 2;
    uint256 constant k2 = 3;
    uint256 constant X2x1 = 21831381940315734285607113342023901060522397560371972897001948545212302161822;
    uint256 constant X2x2 = 17231025384763736816414546592865244497437017442647097510447326538965263639101;
    uint256 constant X2y1 = 2388026358213174446665280700919698872609886601280537296205114254867301080648;
    uint256 constant X2y2 = 11507326595632554467052522095592665270651932854513688777769618397986436103170;
    
    uint256 constant q = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    uint256 constant qf = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
    uint256 constant w1 = 1120550406532664055539694724667294622065367841900378087843176726913374367458;    
    
    uint256 constant G1x = 1;
    uint256 constant G1y = 2;
    uint256 constant G2x1 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant G2x2 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant G2y1 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant G2y2 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint16 constant pA = 32;
    uint16 constant pB = 96;
    uint16 constant pC = 160;
    uint16 constant pZ = 224;
    uint16 constant pT1 = 288;
    uint16 constant pT2 = 352;
    uint16 constant pT3 = 416;
    uint16 constant pWxi = 480;
    uint16 constant pWxiw = 544;
    uint16 constant pEval_a = 608;
    uint16 constant pEval_b = 640;
    uint16 constant pEval_c = 672;
    uint16 constant pEval_s1 = 704;
    uint16 constant pEval_s2 = 736;
    uint16 constant pEval_zw = 768;
    uint16 constant pEval_r = 800;
    
    uint16 constant pAlpha = 0;
    uint16 constant pBeta = 32;
    uint16 constant pGamma = 64;
    uint16 constant pXi = 96;
    uint16 constant pXin = 128;
    uint16 constant pBetaXi = 160;
    uint16 constant pV1 = 192;
    uint16 constant pV2 = 224;
    uint16 constant pV3 = 256;
    uint16 constant pV4 = 288;
    uint16 constant pV5 = 320;
    uint16 constant pV6 = 352;
    uint16 constant pU = 384;
    uint16 constant pPl = 416;
    uint16 constant pEval_t = 448;
    uint16 constant pA1 = 480;
    uint16 constant pB1 = 544;
    uint16 constant pZh = 608;
    uint16 constant pZhInv = 640;
    
    uint16 constant pEval_l1 = 672;
    
    uint16 constant pEval_l2 = 704;
    
    uint16 constant pEval_l3 = 736;
    
    uint16 constant pEval_l4 = 768;
    
    uint16 constant pEval_l5 = 800;
    
    uint16 constant pEval_l6 = 832;
    
    uint16 constant pEval_l7 = 864;
    
    uint16 constant pEval_l8 = 896;
    
    uint16 constant pEval_l9 = 928;
    
    uint16 constant pEval_l10 = 960;
    
    uint16 constant pEval_l11 = 992;
    
    uint16 constant pEval_l12 = 1024;
    
    uint16 constant pEval_l13 = 1056;
    
    uint16 constant pEval_l14 = 1088;
    
    uint16 constant pEval_l15 = 1120;
    
    uint16 constant pEval_l16 = 1152;
    
    
    
    uint16 constant lastMem = 1184;

    function verifyProof(bytes memory proof, uint[] memory pubSignals) public view returns (bool) {
        assembly {
            /////////
            // Computes the inverse using the extended euclidean algorithm
            /////////
            function inverse(a, q) -> inv {
                let t := 0     
                let newt := 1
                let r := q     
                let newr := a
                let quotient
                let aux
                
                for { } newr { } {
                    quotient := sdiv(r, newr)
                    aux := sub(t, mul(quotient, newt))
                    t:= newt
                    newt:= aux
                    
                    aux := sub(r,mul(quotient, newr))
                    r := newr
                    newr := aux
                }
                
                if gt(r, 1) { revert(0,0) }
                if slt(t, 0) { t:= add(t, q) }

                inv := t
            }
            
            ///////
            // Computes the inverse of an array of values
            // See https://vitalik.ca/general/2018/07/21/starks_part_3.html in section where explain fields operations
            //////
            function inverseArray(pVals, n) {
    
                let pAux := mload(0x40)     // Point to the next free position
                let pIn := pVals
                let lastPIn := add(pVals, mul(n, 32))  // Read n elemnts
                let acc := mload(pIn)       // Read the first element
                pIn := add(pIn, 32)         // Point to the second element
                let inv
    
                
                for { } lt(pIn, lastPIn) { 
                    pAux := add(pAux, 32) 
                    pIn := add(pIn, 32)
                } 
                {
                    mstore(pAux, acc)
                    acc := mulmod(acc, mload(pIn), q)
                }
                acc := inverse(acc, q)
                
                // At this point pAux pint to the next free position we substract 1 to point to the last used
                pAux := sub(pAux, 32)
                // pIn points to the n+1 element, we substract to point to n
                pIn := sub(pIn, 32)
                lastPIn := pVals  // We don't process the first element 
                for { } gt(pIn, lastPIn) { 
                    pAux := sub(pAux, 32) 
                    pIn := sub(pIn, 32)
                } 
                {
                    inv := mulmod(acc, mload(pAux), q)
                    acc := mulmod(acc, mload(pIn), q)
                    mstore(pIn, inv)
                }
                // pIn points to first element, we just set it.
                mstore(pIn, acc)
            }
            
            function checkField(v) {
                if iszero(lt(v, q)) {
                    mstore(0, 0)
                    return(0,0x20)
                }
            }
            
            function checkInput(pProof) {
                if iszero(eq(mload(pProof), 800 )) {
                    mstore(0, 0)
                    return(0,0x20)
                }
                checkField(mload(add(pProof, pEval_a)))
                checkField(mload(add(pProof, pEval_b)))
                checkField(mload(add(pProof, pEval_c)))
                checkField(mload(add(pProof, pEval_s1)))
                checkField(mload(add(pProof, pEval_s2)))
                checkField(mload(add(pProof, pEval_zw)))
                checkField(mload(add(pProof, pEval_r)))

                // Points are checked in the point operations precompiled smart contracts
            }
            
            function calculateChallanges(pProof, pMem, pPublic) {
            
                let a
                let b

                
                mstore( add(pMem, 1184 ), mload( add( pPublic, 32)))
                
                mstore( add(pMem, 1216 ), mload( add( pPublic, 64)))
                
                mstore( add(pMem, 1248 ), mload( add( pPublic, 96)))
                
                mstore( add(pMem, 1280 ), mload( add( pPublic, 128)))
                
                mstore( add(pMem, 1312 ), mload( add( pPublic, 160)))
                
                mstore( add(pMem, 1344 ), mload( add( pPublic, 192)))
                
                mstore( add(pMem, 1376 ), mload( add( pPublic, 224)))
                
                mstore( add(pMem, 1408 ), mload( add( pPublic, 256)))
                
                mstore( add(pMem, 1440 ), mload( add( pPublic, 288)))
                
                mstore( add(pMem, 1472 ), mload( add( pPublic, 320)))
                
                mstore( add(pMem, 1504 ), mload( add( pPublic, 352)))
                
                mstore( add(pMem, 1536 ), mload( add( pPublic, 384)))
                
                mstore( add(pMem, 1568 ), mload( add( pPublic, 416)))
                
                mstore( add(pMem, 1600 ), mload( add( pPublic, 448)))
                
                mstore( add(pMem, 1632 ), mload( add( pPublic, 480)))
                
                mstore( add(pMem, 1664 ), mload( add( pPublic, 512)))
                
                mstore( add(pMem, 1696 ), mload( add( pProof, pA)))
                mstore( add(pMem, 1728 ), mload( add( pProof, add(pA,32))))
                mstore( add(pMem, 1760 ), mload( add( pProof, add(pA,64))))
                mstore( add(pMem, 1792 ), mload( add( pProof, add(pA,96))))
                mstore( add(pMem, 1824 ), mload( add( pProof, add(pA,128))))
                mstore( add(pMem, 1856 ), mload( add( pProof, add(pA,160))))
                
                b := mod(keccak256(add(pMem, lastMem), 704), q) 
                mstore( add(pMem, pBeta), b)
                mstore( add(pMem, pGamma), mod(keccak256(add(pMem, pBeta), 32), q))
                mstore( add(pMem, pAlpha), mod(keccak256(add(pProof, pZ), 64), q))
                
                a := mod(keccak256(add(pProof, pT1), 192), q)
                mstore( add(pMem, pXi), a)
                mstore( add(pMem, pBetaXi), mulmod(b, a, q))
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                a:= mulmod(a, a, q)
                
                mstore( add(pMem, pXin), a)
                a:= mod(add(sub(a, 1),q), q)
                mstore( add(pMem, pZh), a)
                mstore( add(pMem, pZhInv), a)  // We will invert later together with lagrange pols
                
                let v1 := mod(keccak256(add(pProof, pEval_a), 224), q)
                mstore( add(pMem, pV1), v1)
                a := mulmod(v1, v1, q)
                mstore( add(pMem, pV2), a)
                a := mulmod(a, v1, q)
                mstore( add(pMem, pV3), a)
                a := mulmod(a, v1, q)
                mstore( add(pMem, pV4), a)
                a := mulmod(a, v1, q)
                mstore( add(pMem, pV5), a)
                a := mulmod(a, v1, q)
                mstore( add(pMem, pV6), a)
                
                mstore( add(pMem, pU), mod(keccak256(add(pProof, pWxi), 128), q))
            }
            
            function calculateLagrange(pMem) {

                let w := 1                
                
                mstore(
                    add(pMem, pEval_l1), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l2), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l3), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l4), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l5), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l6), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l7), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l8), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l9), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l10), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l11), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l12), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l13), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l14), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l15), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                w := mulmod(w, w1, q)
                
                
                mstore(
                    add(pMem, pEval_l16), 
                    mulmod(
                        n, 
                        mod(
                            add(
                                sub(
                                    mload(add(pMem, pXi)), 
                                    w
                                ), 
                                q
                            ),
                            q
                        ), 
                        q
                    )
                )
                
                
                
                inverseArray(add(pMem, pZhInv), 17 )
                
                let zh := mload(add(pMem, pZh))
                w := 1
                
                
                mstore(
                    add(pMem, pEval_l1 ), 
                    mulmod(
                        mload(add(pMem, pEval_l1 )),
                        zh,
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l2), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l2)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l3), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l3)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l4), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l4)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l5), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l5)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l6), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l6)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l7), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l7)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l8), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l8)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l9), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l9)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l10), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l10)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l11), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l11)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l12), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l12)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l13), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l13)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l14), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l14)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l15), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l15)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                w := mulmod(w, w1, q)
                
                
                
                mstore(
                    add(pMem, pEval_l16), 
                    mulmod(
                        w,
                        mulmod(
                            mload(add(pMem, pEval_l16)),
                            zh,
                            q
                        ),
                        q
                    )
                )
                
                
                


            }
            
            function calculatePl(pMem, pPub) {
                let pl := 0
                
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l1)),
                                mload(add(pPub, 32)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l2)),
                                mload(add(pPub, 64)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l3)),
                                mload(add(pPub, 96)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l4)),
                                mload(add(pPub, 128)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l5)),
                                mload(add(pPub, 160)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l6)),
                                mload(add(pPub, 192)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l7)),
                                mload(add(pPub, 224)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l8)),
                                mload(add(pPub, 256)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l9)),
                                mload(add(pPub, 288)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l10)),
                                mload(add(pPub, 320)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l11)),
                                mload(add(pPub, 352)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l12)),
                                mload(add(pPub, 384)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l13)),
                                mload(add(pPub, 416)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l14)),
                                mload(add(pPub, 448)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l15)),
                                mload(add(pPub, 480)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                 
                pl := mod(
                    add(
                        sub(
                            pl,  
                            mulmod(
                                mload(add(pMem, pEval_l16)),
                                mload(add(pPub, 512)),
                                q
                            )
                        ),
                        q
                    ),
                    q
                )
                
                
                mstore(add(pMem, pPl), pl)
                

            }

            function calculateT(pProof, pMem) {
                let t
                let t1
                let t2
                t := addmod(
                    mload(add(pProof, pEval_r)), 
                    mload(add(pMem, pPl)), 
                    q
                )
                
                t1 := mulmod(
                    mload(add(pProof, pEval_s1)),
                    mload(add(pMem, pBeta)),
                    q
                )

                t1 := addmod(
                    t1,
                    mload(add(pProof, pEval_a)),
                    q
                )
                
                t1 := addmod(
                    t1,
                    mload(add(pMem, pGamma)),
                    q
                )

                t2 := mulmod(
                    mload(add(pProof, pEval_s2)),
                    mload(add(pMem, pBeta)),
                    q
                )

                t2 := addmod(
                    t2,
                    mload(add(pProof, pEval_b)),
                    q
                )
                
                t2 := addmod(
                    t2,
                    mload(add(pMem, pGamma)),
                    q
                )
                
                t1 := mulmod(t1, t2, q)
                
                t2 := addmod(
                    mload(add(pProof, pEval_c)),
                    mload(add(pMem, pGamma)),
                    q
                )

                t1 := mulmod(t1, t2, q)
                t1 := mulmod(t1, mload(add(pProof, pEval_zw)), q)
                t1 := mulmod(t1, mload(add(pMem, pAlpha)), q)
                
                t2 := mulmod(
                    mload(add(pMem, pEval_l1)), 
                    mload(add(pMem, pAlpha)), 
                    q
                )

                t2 := mulmod(
                    t2, 
                    mload(add(pMem, pAlpha)), 
                    q
                )

                t1 := addmod(t1, t2, q)
                
                t := mod(sub(add(t, q), t1), q)
                t := mulmod(t, mload(add(pMem, pZhInv)), q)
                
                mstore( add(pMem, pEval_t) , t)

            }
            
            function g1_set(pR, pP) {
                mstore(pR, mload(pP))
                mstore(add(pR, 32), mload(add(pP,32)))
            }

            function g1_acc(pR, pP) {
                let mIn := mload(0x40)
                mstore(mIn, mload(pR))
                mstore(add(mIn,32), mload(add(pR, 32)))
                mstore(add(mIn,64), mload(pP))
                mstore(add(mIn,96), mload(add(pP, 32)))

                let success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)
                
                if iszero(success) {
                    mstore(0, 0)
                    return(0,0x20)
                }
            }

            function g1_mulAcc(pR, pP, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, mload(pP))
                mstore(add(mIn,32), mload(add(pP, 32)))
                mstore(add(mIn,64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)
                
                if iszero(success) {
                    mstore(0, 0)
                    return(0,0x20)
                }
                
                mstore(add(mIn,64), mload(pR))
                mstore(add(mIn,96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)
                
                if iszero(success) {
                    mstore(0, 0)
                    return(0,0x20)
                }
                
            }

            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn,32), y)
                mstore(add(mIn,64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)
                
                if iszero(success) {
                    mstore(0, 0)
                    return(0,0x20)
                }
                
                mstore(add(mIn,64), mload(pR))
                mstore(add(mIn,96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)
                
                if iszero(success) {
                    mstore(0, 0)
                    return(0,0x20)
                }
            }

            function g1_mulSetC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn,32), y)
                mstore(add(mIn,64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, pR, 64)
                
                if iszero(success) {
                    mstore(0, 0)
                    return(0,0x20)
                }
            }


            function calculateA1(pProof, pMem) {
                let p := add(pMem, pA1)
                g1_set(p, add(pProof, pWxi))
                g1_mulAcc(p, add(pProof, pWxiw), mload(add(pMem, pU)))
            }
            
            
            function calculateB1(pProof, pMem) {
                let s
                let s1
                let p := add(pMem, pB1)
                
                // Calculate D
                s := mulmod( mload(add(pProof, pEval_a)), mload(add(pMem, pV1)), q)
                g1_mulSetC(p, Qlx, Qly, s)

                s := mulmod( s, mload(add(pProof, pEval_b)), q)                
                g1_mulAccC(p, Qmx, Qmy, s)

                s := mulmod( mload(add(pProof, pEval_b)), mload(add(pMem, pV1)), q)
                g1_mulAccC(p, Qrx, Qry, s)
                
                s := mulmod( mload(add(pProof, pEval_c)), mload(add(pMem, pV1)), q)
                g1_mulAccC(p, Qox, Qoy, s)

                s :=mload(add(pMem, pV1))
                g1_mulAccC(p, Qcx, Qcy, s)

                s := addmod(mload(add(pProof, pEval_a)), mload(add(pMem, pBetaXi)), q)
                s := addmod(s, mload(add(pMem, pGamma)), q)
                s1 := mulmod(k1, mload(add(pMem, pBetaXi)), q)
                s1 := addmod(s1, mload(add(pProof, pEval_b)), q)
                s1 := addmod(s1, mload(add(pMem, pGamma)), q)
                s := mulmod(s, s1, q)
                s1 := mulmod(k2, mload(add(pMem, pBetaXi)), q)
                s1 := addmod(s1, mload(add(pProof, pEval_c)), q)
                s1 := addmod(s1, mload(add(pMem, pGamma)), q)
                s := mulmod(s, s1, q)
                s := mulmod(s, mload(add(pMem, pAlpha)), q)
                s := mulmod(s, mload(add(pMem, pV1)), q)
                s1 := mulmod(mload(add(pMem, pEval_l1)), mload(add(pMem, pAlpha)), q)
                s1 := mulmod(s1, mload(add(pMem, pAlpha)), q)
                s1 := mulmod(s1, mload(add(pMem, pV1)), q)
                s := addmod(s, s1, q)
                s := addmod(s, mload(add(pMem, pU)), q)
                g1_mulAcc(p, add(pProof, pZ), s)
                
                s := mulmod(mload(add(pMem, pBeta)), mload(add(pProof, pEval_s1)), q)
                s := addmod(s, mload(add(pProof, pEval_a)), q)
                s := addmod(s, mload(add(pMem, pGamma)), q)
                s1 := mulmod(mload(add(pMem, pBeta)), mload(add(pProof, pEval_s2)), q)
                s1 := addmod(s1, mload(add(pProof, pEval_b)), q)
                s1 := addmod(s1, mload(add(pMem, pGamma)), q)
                s := mulmod(s, s1, q)
                s := mulmod(s, mload(add(pMem, pAlpha)), q)
                s := mulmod(s, mload(add(pMem, pV1)), q)
                s := mulmod(s, mload(add(pMem, pBeta)), q)
                s := mulmod(s, mload(add(pProof, pEval_zw)), q)
                s := mod(sub(q, s), q)
                g1_mulAccC(p, S3x, S3y, s)


                // calculate F
                g1_acc(p , add(pProof, pT1))

                s := mload(add(pMem, pXin))
                g1_mulAcc(p, add(pProof, pT2), s)
                
                s := mulmod(s, s, q)
                g1_mulAcc(p, add(pProof, pT3), s)
                
                g1_mulAcc(p, add(pProof, pA), mload(add(pMem, pV2)))
                g1_mulAcc(p, add(pProof, pB), mload(add(pMem, pV3)))
                g1_mulAcc(p, add(pProof, pC), mload(add(pMem, pV4)))
                g1_mulAccC(p, S1x, S1y, mload(add(pMem, pV5)))
                g1_mulAccC(p, S2x, S2y, mload(add(pMem, pV6)))
                
                // calculate E
                s := mload(add(pMem, pEval_t))
                s := addmod(s, mulmod(mload(add(pProof, pEval_r)), mload(add(pMem, pV1)), q), q)
                s := addmod(s, mulmod(mload(add(pProof, pEval_a)), mload(add(pMem, pV2)), q), q)
                s := addmod(s, mulmod(mload(add(pProof, pEval_b)), mload(add(pMem, pV3)), q), q)
                s := addmod(s, mulmod(mload(add(pProof, pEval_c)), mload(add(pMem, pV4)), q), q)
                s := addmod(s, mulmod(mload(add(pProof, pEval_s1)), mload(add(pMem, pV5)), q), q)
                s := addmod(s, mulmod(mload(add(pProof, pEval_s2)), mload(add(pMem, pV6)), q), q)
                s := addmod(s, mulmod(mload(add(pProof, pEval_zw)), mload(add(pMem, pU)), q), q)
                s := mod(sub(q, s), q)
                g1_mulAccC(p, G1x, G1y, s)
                
                
                // Last part of B
                s := mload(add(pMem, pXi))
                g1_mulAcc(p, add(pProof, pWxi), s)

                s := mulmod(mload(add(pMem, pU)), mload(add(pMem, pXi)), q)
                s := mulmod(s, w1, q)
                g1_mulAcc(p, add(pProof, pWxiw), s)

            }
            
            function checkPairing(pMem) -> isOk {
                let mIn := mload(0x40)
                mstore(mIn, mload(add(pMem, pA1)))
                mstore(add(mIn,32), mload(add(add(pMem, pA1), 32)))
                mstore(add(mIn,64), X2x2)
                mstore(add(mIn,96), X2x1)
                mstore(add(mIn,128), X2y2)
                mstore(add(mIn,160), X2y1)
                mstore(add(mIn,192), mload(add(pMem, pB1)))
                let s := mload(add(add(pMem, pB1), 32))
                s := mod(sub(qf, s), qf)
                mstore(add(mIn,224), s)
                mstore(add(mIn,256), G2x2)
                mstore(add(mIn,288), G2x1)
                mstore(add(mIn,320), G2y2)
                mstore(add(mIn,352), G2y1)
                
                let success := staticcall(sub(gas(), 2000), 8, mIn, 384, mIn, 0x20)
                
                isOk := and(success, mload(mIn))
            }
            
            let pMem := mload(0x40)
            mstore(0x40, add(pMem, lastMem))
            
            checkInput(proof)
            calculateChallanges(proof, pMem, pubSignals)
            calculateLagrange(pMem)
            calculatePl(pMem, pubSignals)
            calculateT(proof, pMem)
            calculateA1(proof, pMem)
            calculateB1(proof, pMem)
            let isValid := checkPairing(pMem)
            
            mstore(0x40, sub(pMem, lastMem))
            mstore(0, isValid)
            return(0,0x20)
        }
        
    }
}
