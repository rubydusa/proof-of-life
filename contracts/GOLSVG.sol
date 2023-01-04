// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./interfaces/IGOLSVG.sol";

contract GOLSVG is IGOLSVG {
    using Strings for uint256;

    uint256 constant W = 8;
    uint256 constant H = 8;
    uint256 constant CELL_W = 10;
    uint256 constant CELL_H = 10;
    uint256 constant REGULAR_TEMPLATE_COUNT = 32;
    uint256 constant END_TEMPLATE_COUNT = 16;

    string constant RECT_A = '<rect id="';
    string constant RECT_B = '" x="';
    string constant RECT_C = '" y="';
    string constant RECT_D = '" class="';
    string constant RECT_E = '"/>';
    string constant TEXT_A = '<text font-family="monospace" text-anchor="middle" x="50" y="100" width="100" font-size="8">#';
    string constant TEXT_B = '</text>';
    string constant SVG_A = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">';
    string constant SVG_B = '</svg>';
    string constant STYLE = '<style type="text/css">:root {--t: #7232f2;--b: #fff;--e: #000} rect {fill: var(--b);stroke: var(--e);width: 10px;height: 10px} text {color: #000} @keyframes r0 {7.69%,15.38%,30.77%,38.46%,76.92% {fill: var(--t)}0%,23.08%,46.15%,69.23%,84.62%,92.31%,100% {fill: var(--b)}} .r0 {animation: r0 5s ease-in 0s normal 1 forwards} @keyframes r1 {7.69%,23.08%,38.46% {fill: var(--t)}0%,15.38%,30.77%,46.15%,92.31%,100% {fill: var(--b)}} .r1 {animation: r1 5s ease-in 0s normal 1 forwards} @keyframes r2 {15.38%,30.77%,46.15%,69.23% {fill: var(--t)}0%,7.69%,23.08%,38.46%,53.85%,61.54%,76.92%,92.31%,100% {fill: var(--b)}} .r2 {animation: r2 5s ease-in 0s normal 1 forwards} @keyframes r3 {23.08%,38.46%,84.62% {fill: var(--t)}0%,15.38%,30.77%,46.15%,76.92%,92.31%,100% {fill: var(--b)}} .r3 {animation: r3 5s ease-in 0s normal 1 forwards} @keyframes r4 {7.69%,15.38%,46.15%,84.62% {fill: var(--t)}0%,23.08%,38.46%,92.31%,100% {fill: var(--b)}} .r4 {animation: r4 5s ease-in 0s normal 1 forwards} @keyframes r5 {7.69%,15.38%,30.77%,46.15%,69.23%,92.31% {fill: var(--t)}0%,23.08%,38.46%,53.85%,61.54%,100% {fill: var(--b)}} .r5 {animation: r5 5s ease-in 0s normal 1 forwards} @keyframes r6 {7.69%,23.08%,46.15%,61.54%,76.92%,92.31% {fill: var(--t)}0%,30.77%,38.46%,53.85%,84.62%,100% {fill: var(--b)}} .r6 {animation: r6 5s ease-in 0s normal 1 forwards} @keyframes r7 {7.69%,38.46%,53.85%,92.31% {fill: var(--t)}0%,46.15%,61.54%,84.62%,100% {fill: var(--b)}} .r7 {animation: r7 5s ease-in 0s normal 1 forwards} @keyframes r8 {7.69%,15.38%,61.54%,76.92%,92.31% {fill: var(--t)}0%,23.08%,53.85%,69.23%,100% {fill: var(--b)}} .r8 {animation: r8 5s ease-in 0s normal 1 forwards} @keyframes r9 {7.69%,23.08%,30.77% {fill: var(--t)}0%,15.38%,38.46%,92.31%,100% {fill: var(--b)}} .r9 {animation: r9 5s ease-in 0s normal 1 forwards} @keyframes r10 {7.69%,15.38%,30.77%,69.23% {fill: var(--t)}0%,23.08%,38.46%,61.54%,76.92%,92.31%,100% {fill: var(--b)}} .r10 {animation: r10 5s ease-in 0s normal 1 forwards} @keyframes r11 {15.38%,30.77%,46.15%,61.54%,92.31% {fill: var(--t)}0%,7.69%,23.08%,53.85%,69.23%,84.62%,100% {fill: var(--b)}} .r11 {animation: r11 5s ease-in 0s normal 1 forwards} @keyframes r12 {7.69%,30.77%,46.15%,69.23%,92.31% {fill: var(--t)}0%,15.38%,23.08%,38.46%,53.85%,61.54%,100% {fill: var(--b)}} .r12 {animation: r12 5s ease-in 0s normal 1 forwards} @keyframes r13 {7.69%,30.77%,46.15%,61.54%,92.31% {fill: var(--t)}0%,15.38%,23.08%,38.46%,69.23%,84.62%,100% {fill: var(--b)}} .r13 {animation: r13 5s ease-in 0s normal 1 forwards} @keyframes r14 {7.69%,23.08%,38.46%,61.54%,76.92% {fill: var(--t)}0%,15.38%,46.15%,53.85%,84.62%,92.31%,100% {fill: var(--b)}} .r14 {animation: r14 5s ease-in 0s normal 1 forwards} @keyframes r15 {23.08%,38.46%,61.54%,92.31% {fill: var(--t)}0%,15.38%,30.77%,46.15%,53.85%,100% {fill: var(--b)}} .r15 {animation: r15 5s ease-in 0s normal 1 forwards} @keyframes r16 {15.38%,23.08%,46.15%,53.85%,76.92% {fill: var(--t)}0%,7.69%,30.77%,38.46%,61.54%,69.23%,84.62%,92.31%,100% {fill: var(--b)}} .r16 {animation: r16 5s ease-in 0s normal 1 forwards} @keyframes r17 {7.69%,15.38%,30.77%,53.85%,69.23%,76.92%,92.31% {fill: var(--t)}0%,23.08%,61.54%,84.62%,100% {fill: var(--b)}} .r17 {animation: r17 5s ease-in 0s normal 1 forwards} @keyframes r18 {15.38%,23.08%,38.46%,76.92% {fill: var(--t)}0%,7.69%,30.77%,46.15%,69.23%,84.62%,92.31%,100% {fill: var(--b)}} .r18 {animation: r18 5s ease-in 0s normal 1 forwards} @keyframes r19 {15.38%,23.08%,38.46%,61.54% {fill: var(--t)}0%,7.69%,30.77%,46.15%,53.85%,69.23%,92.31%,100% {fill: var(--b)}} .r19 {animation: r19 5s ease-in 0s normal 1 forwards} @keyframes r20 {46.15%,53.85%,69.23%,76.92% {fill: var(--t)}0%,38.46%,61.54%,84.62%,92.31%,100% {fill: var(--b)}} .r20 {animation: r20 5s ease-in 0s normal 1 forwards} @keyframes r21 {7.69%,30.77%,38.46%,76.92%,84.62% {fill: var(--t)}0%,15.38%,23.08%,46.15%,69.23%,92.31%,100% {fill: var(--b)}} .r21 {animation: r21 5s ease-in 0s normal 1 forwards} @keyframes r22 {30.77%,46.15%,92.31% {fill: var(--t)}0%,23.08%,38.46%,53.85%,84.62%,100% {fill: var(--b)}} .r22 {animation: r22 5s ease-in 0s normal 1 forwards} @keyframes r23 {7.69%,15.38%,30.77%,69.23% {fill: var(--t)}0%,23.08%,38.46%,61.54%,76.92%,92.31%,100% {fill: var(--b)}} .r23 {animation: r23 5s ease-in 0s normal 1 forwards} @keyframes r24 {7.69%,23.08%,61.54%,84.62%,92.31% {fill: var(--t)}0%,30.77%,53.85%,69.23%,76.92%,100% {fill: var(--b)}} .r24 {animation: r24 5s ease-in 0s normal 1 forwards} @keyframes r25 {15.38%,30.77%,53.85%,69.23%,76.92% {fill: var(--t)}0%,7.69%,23.08%,38.46%,46.15%,61.54%,84.62%,92.31%,100% {fill: var(--b)}} .r25 {animation: r25 5s ease-in 0s normal 1 forwards} @keyframes r26 {69.23%,76.92% {fill: var(--t)}0%,61.54%,84.62%,92.31%,100% {fill: var(--b)}} .r26 {animation: r26 5s ease-in 0s normal 1 forwards} @keyframes r27 {23.08%,30.77%,53.85%,84.62% {fill: var(--t)}0%,15.38%,38.46%,46.15%,92.31%,100% {fill: var(--b)}} .r27 {animation: r27 5s ease-in 0s normal 1 forwards} @keyframes r28 {15.38%,38.46%,53.85%,69.23%,76.92%,92.31% {fill: var(--t)}0%,7.69%,23.08%,30.77%,46.15%,61.54%,84.62%,100% {fill: var(--b)}} .r28 {animation: r28 5s ease-in 0s normal 1 forwards} @keyframes r29 {7.69%,30.77%,46.15%,61.54%,84.62% {fill: var(--t)}0%,15.38%,23.08%,38.46%,53.85%,69.23%,76.92%,92.31%,100% {fill: var(--b)}} .r29 {animation: r29 5s ease-in 0s normal 1 forwards} @keyframes r30 {30.77%,53.85%,69.23%,84.62% {fill: var(--t)}0%,23.08%,61.54%,92.31%,100% {fill: var(--b)}} .r30 {animation: r30 5s ease-in 0s normal 1 forwards} @keyframes r31 {7.69%,15.38%,30.77%,46.15%,69.23%,92.31% {fill: var(--t)}0%,23.08%,38.46%,53.85%,61.54%,76.92%,84.62%,100% {fill: var(--b)}} .r31 {animation: r31 5s ease-in 0s normal 1 forwards} @keyframes e0 {38.46%,69.23%,76.92%,92.31% {fill: var(--t)}0%,30.77%,46.15%,61.54%,84.62% {fill: var(--b)}100% {fill: var(--e)}} .e0 {animation: e0 5s ease-in 0s normal 1 forwards} @keyframes e1 {7.69%,15.38%,46.15%,69.23%,92.31% {fill: var(--t)}0%,23.08%,38.46%,76.92%,84.62% {fill: var(--b)}100% {fill: var(--e)}} .e1 {animation: e1 5s ease-in 0s normal 1 forwards} @keyframes e2 {23.08%,46.15%,61.54%,84.62% {fill: var(--t)}0%,15.38%,30.77%,38.46%,53.85%,69.23%,76.92%,92.31% {fill: var(--b)}100% {fill: var(--e)}} .e2 {animation: e2 5s ease-in 0s normal 1 forwards} @keyframes e3 {7.69%,30.77%,46.15%,61.54%,76.92%,92.31% {fill: var(--t)}0%,38.46%,53.85%,84.62% {fill: var(--b)}100% {fill: var(--e)}} .e3 {animation: e3 5s ease-in 0s normal 1 forwards} @keyframes e4 {7.69%,38.46%,69.23%,76.92%,92.31% {fill: var(--t)}0%,46.15%,61.54%,84.62% {fill: var(--b)}100% {fill: var(--e)}} .e4 {animation: e4 5s ease-in 0s normal 1 forwards} @keyframes e5 {7.69%,30.77%,46.15%,61.54%,76.92% {fill: var(--t)}0%,15.38%,23.08%,38.46%,69.23%,84.62%,92.31% {fill: var(--b)}100% {fill: var(--e)}} .e5 {animation: e5 5s ease-in 0s normal 1 forwards} @keyframes e6 {30.77%,46.15%,69.23%,84.62% {fill: var(--t)}0%,23.08%,38.46%,53.85%,61.54%,76.92%,92.31% {fill: var(--b)}100% {fill: var(--e)}} .e6 {animation: e6 5s ease-in 0s normal 1 forwards} @keyframes e7 {23.08%,30.77%,69.23%,76.92%,92.31% {fill: var(--t)}0%,15.38%,38.46%,61.54%,84.62% {fill: var(--b)}100% {fill: var(--e)}} .e7 {animation: e7 5s ease-in 0s normal 1 forwards} @keyframes e8 {23.08%,76.92%,92.31% {fill: var(--t)}0%,15.38%,30.77%,69.23%,84.62% {fill: var(--b)}100% {fill: var(--e)}} .e8 {animation: e8 5s ease-in 0s normal 1 forwards} @keyframes e9 {15.38%,30.77%,46.15%,69.23%,84.62% {fill: var(--t)}0%,7.69%,23.08%,53.85%,61.54%,92.31% {fill: var(--b)}100% {fill: var(--e)}} .e9 {animation: e9 5s ease-in 0s normal 1 forwards} @keyframes e10 {15.38%,23.08% {fill: var(--t)}0%,7.69%,30.77%,92.31% {fill: var(--b)}100% {fill: var(--e)}} .e10 {animation: e10 5s ease-in 0s normal 1 forwards} @keyframes e11 {46.15%,53.85%,92.31% {fill: var(--t)}0%,38.46%,61.54%,84.62% {fill: var(--b)}100% {fill: var(--e)}} .e11 {animation: e11 5s ease-in 0s normal 1 forwards} @keyframes e12 {15.38%,46.15%,61.54%,84.62%,92.31% {fill: var(--t)}0%,7.69%,23.08%,38.46%,69.23%,76.92% {fill: var(--b)}100% {fill: var(--e)}} .e12 {animation: e12 5s ease-in 0s normal 1 forwards} @keyframes e13 {7.69%,23.08%,53.85%,69.23% {fill: var(--t)}0%,15.38%,61.54%,76.92%,92.31% {fill: var(--b)}100% {fill: var(--e)}} .e13 {animation: e13 5s ease-in 0s normal 1 forwards} @keyframes e14 {23.08%,38.46%,53.85%,92.31% {fill: var(--t)}0%,15.38%,30.77%,46.15%,61.54%,84.62% {fill: var(--b)}100% {fill: var(--e)}} .e14 {animation: e14 5s ease-in 0s normal 1 forwards} @keyframes e15 {38.46%,53.85%,76.92%,84.62% {fill: var(--t)}0%,30.77%,61.54%,69.23%,92.31% {fill: var(--b)}100% {fill: var(--e)}} .e15 {animation: e15 5s ease-in 0s normal 1 forwards}</style>';

    function svg(uint256 n, uint256 data) external pure returns (bytes memory) {
        uint256 rnd = uint256(keccak256(abi.encodePacked(n, data)));
        uint256 i = 0;
        
        bytes memory rects = "";
        for (uint256 x = 0; x < W; x++) {
            for (uint256 y = 0; y < H; y++) {
                rects = abi.encodePacked(
                    rects,
                    RECT_A,
                    x.toString(),
                    "-",
                    y.toString(),
                    RECT_B,
                    ((x + 1) * CELL_W).toString(),
                    RECT_C,
                    ((y + 1) * CELL_H).toString(),
                    RECT_D
                );

                bool isAlive = (data >> (y + x * H)) & 1 == 1;
                if (isAlive) {
                    rects = abi.encodePacked(
                        rects,
                        "e",
                        (((rnd >> i) & 255) % END_TEMPLATE_COUNT).toString(),
                        RECT_E
                    );
                }
                else {
                    rects = abi.encodePacked(
                        rects,
                        "r",
                        (((rnd >> i) & 255) % REGULAR_TEMPLATE_COUNT).toString(),
                        RECT_E
                    );
                }

                i++;
                i = i % 256;
            } 
        }

        return abi.encodePacked(
            SVG_A,
            STYLE,
            rects,
            TEXT_A,
            n.toString(),
            TEXT_B,
            SVG_B
        );
    }
}

