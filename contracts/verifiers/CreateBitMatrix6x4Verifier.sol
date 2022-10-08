//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// 2019 OKIMS
//      ported to solidity 0.6
//      fixed linter warnings
//      added requiere error messages
//
//
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.11;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() internal pure returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() internal pure returns (G2Point memory) {
        // Original code point
        return G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );

/*
        // Changed by Jordi point
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
*/
    }
    /// @return r the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) internal pure returns (G1Point memory r) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success,"pairing-add-failed");
    }
    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success,"pairing-mul-failed");
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length,"pairing-lengths-failed");
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[0];
            input[i * 6 + 3] = p2[i].X[1];
            input[i * 6 + 4] = p2[i].Y[0];
            input[i * 6 + 5] = p2[i].Y[1];
        }
        uint[1] memory out;
        bool success;
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success,"pairing-opcode-failed");
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}
contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[] IC;
    }
    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }
    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Pairing.G1Point(
            20491192805390485299153009773594534940189261866228447918068658471970481763042,
            9383485363053290200918347156157836566562967994039712273449902621266178545958
        );

        vk.beta2 = Pairing.G2Point(
            [4252822878758300859123897981450591353533073413197771768651442665752259397132,
             6375614351688725206403948262868962793625744043794305715222011528459656738731],
            [21847035105528745403288232691147584728191162732299865338377159692350059136679,
             10505242626370262277552901082094356697409835680220590971873171140371331206856]
        );
        vk.gamma2 = Pairing.G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
        vk.delta2 = Pairing.G2Point(
            [12599857379517512478445603412764121041984228075771497593287716170335433683702,
             7912208710313447447762395792098481825752520616755888860068004689933335666613],
            [11502426145685875357967720478366491326865907869902181704031346886834786027007,
             21679208693936337484429571887537508926366191105267550375038502782696042114705]
        );
        vk.IC = new Pairing.G1Point[](25);
        
        vk.IC[0] = Pairing.G1Point( 
            12854522751795572121691402638123695488444708924422847070000662537991896005441,
            5353739305331070323123754222162715179106703819653391976318504073701514487441
        );                                      
        
        vk.IC[1] = Pairing.G1Point( 
            521195615702030092925823985918610999634202083690261229903080609532640155644,
            14007640799578931276254336033001319131424364277915576520582386188964498297771
        );                                      
        
        vk.IC[2] = Pairing.G1Point( 
            16858163230947388228832626336353976386487510141381590778516960464975282227626,
            5715579968779915641614376454599374882077537383349464674466196653870834046918
        );                                      
        
        vk.IC[3] = Pairing.G1Point( 
            2195380225111375755891178798748592800808993065387221852857687773197488165017,
            13506092192247982651875301051427094577628126240632322880089259877873969011800
        );                                      
        
        vk.IC[4] = Pairing.G1Point( 
            13443904211168267760170043324571694299802944240683554296101865086775153456249,
            19525993885468964388711829680595779774340757472586113896999493797981954410969
        );                                      
        
        vk.IC[5] = Pairing.G1Point( 
            19469761570452817125077873788742053250618990081468030657322712930993866471423,
            19347948086575777564613521405621758579186505718823701568304452820803737428227
        );                                      
        
        vk.IC[6] = Pairing.G1Point( 
            14788868066893495687390542172833729964992166066080741184002635881814999623488,
            6789360479985210804939503550166005802568356388365914921333121120194502407062
        );                                      
        
        vk.IC[7] = Pairing.G1Point( 
            21092345369301216106640027557181285663808360984806049341987305980059262793198,
            48469268884145422078898951386982234368200461981971681663517323747722301222
        );                                      
        
        vk.IC[8] = Pairing.G1Point( 
            7769041939437907526443397812420785466433585830739292960145513836282340711144,
            15010680256694227519561468212221986696972493500141237952480374874625106602304
        );                                      
        
        vk.IC[9] = Pairing.G1Point( 
            9649078452517242688343727950098361320919726855418939284557937770219851433212,
            10075126576071633437778546802419685159813371026335348787669878960420423050152
        );                                      
        
        vk.IC[10] = Pairing.G1Point( 
            16632364296493283180237674043128307416561992052239401835769207543064782060552,
            19168416392215453857921168331550755763024046112465105176681402861220712064406
        );                                      
        
        vk.IC[11] = Pairing.G1Point( 
            2119865264323190408976588342727183571371505292400704417777846270827878359934,
            20669757410575490489216557743348778389915686147808769993782353044099575933633
        );                                      
        
        vk.IC[12] = Pairing.G1Point( 
            1552308819958183899543589886121869591390591634195574730311206841860107964251,
            2035823672486359197634426234265439262985894743352219775329292102198004617800
        );                                      
        
        vk.IC[13] = Pairing.G1Point( 
            4143981901401808013782154459472417714988241258973226684484501248083224080549,
            4428584317994719078151955022823735483093858812786002258483260994958665344875
        );                                      
        
        vk.IC[14] = Pairing.G1Point( 
            19431965311972979458097824405664204648216739628903837950498907059275087926707,
            4057030997651187243011356021015275250081573801807834495748721043176701440613
        );                                      
        
        vk.IC[15] = Pairing.G1Point( 
            14661316190494159278633586032010432608772020412660270954796399791794277107606,
            15071671352963883756935090530802533783482566302628626025895459315031942941416
        );                                      
        
        vk.IC[16] = Pairing.G1Point( 
            2389965005479591165183464138113473348419232132466680179183422819787425388515,
            9045431606034466355757094700838251812768855675165613370156233792786381092366
        );                                      
        
        vk.IC[17] = Pairing.G1Point( 
            13403336729560068511644635676615389189058845561610093683821434708416387211414,
            6357443121202856972301883796614666442909637674608573904118464823102337266729
        );                                      
        
        vk.IC[18] = Pairing.G1Point( 
            720340829748980543378989080012904536204853023689566626158470709208938024690,
            7760821955000692399243855941120298317427440682886405408601710838006386998288
        );                                      
        
        vk.IC[19] = Pairing.G1Point( 
            16325642348871018051391722440341698598244658926920431394260448969071867480947,
            8014833408170415345598127700118782797975145018846236387276588619633664725519
        );                                      
        
        vk.IC[20] = Pairing.G1Point( 
            13051873170665910492912734305252312461123353431827578643454242501565698348532,
            2654293803213899357376470153033439341729615343485517429027447134227247674692
        );                                      
        
        vk.IC[21] = Pairing.G1Point( 
            7817229141479355714950583066008561824265524211798013458533058087097671542624,
            16005883127627193026129614933621167784659341997365379072656689411496603533294
        );                                      
        
        vk.IC[22] = Pairing.G1Point( 
            16379507884672469946405343177688937358886505732643320498900502629064789877329,
            15415214926122445684965191102590091120685946320812090247488353942620065421170
        );                                      
        
        vk.IC[23] = Pairing.G1Point( 
            7295766932804490685952721010034002412971639241486243264088513919157080233931,
            17394069695582853397941680414147940971042965284923868056890682672733394877315
        );                                      
        
        vk.IC[24] = Pairing.G1Point( 
            17915468638053421919361218768361953164188125693710987027565203098250684352457,
            1838106044244903978621491196698194099389504513381665927374226814647609825494
        );                                      
        
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length,"verifier-bad-input");
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field,"verifier-gte-snark-scalar-field");
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.IC[0]);
        if (!Pairing.pairingProd4(
            Pairing.negate(proof.A), proof.B,
            vk.alfa1, vk.beta2,
            vk_x, vk.gamma2,
            proof.C, vk.delta2
        )) return 1;
        return 0;
    }
    /// @return r  bool true if proof is valid
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[24] memory input
        ) public view returns (bool r) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
