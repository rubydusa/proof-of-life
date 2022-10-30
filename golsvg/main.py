from dataclasses import dataclass

from random import seed
from random import random
from random import randrange

SEED = 0

@dataclass(frozen=True)
class Config:
    R: int  # animation repetition
    D: int  # duration (in milliseconds)
    P: float  # probability

    GW: int  # grid width (how many cells, horizontally)
    GH: int  # grid height (how many cells, vertically)
    CW: int  # cell width (how many units width per cell, used to control stroke width)
    CH: int  # cell height (how many units height per cell, used to control stroke width)

    TEMPLATE_COUNT: int
    END_TEMPLATE_COUNT: int
    WHITE: str
    BLACK: str
    PURPLE: str

    @property
    def TOTAL_WIDTH(self):
        return self.CW * (self.GW + 2)

    @property
    def TOTAL_HEIGHT(self):
        return self.CH * (self.GH + 2)

def default_config() -> Config:
    return Config(
        R=12,
        D=200,
        P=0.4,
        GW=8,
        GH=8,
        CW=10,
        CH=10,
        TEMPLATE_COUNT=19,
        END_TEMPLATE_COUNT=19,
        WHITE="#fff",
        BLACK="#111",
        PURPLE="#7232f2"
    )

# make generation determinstic
def initialize_env() -> None:
    seed(SEED)

'''
Grid
'''
def create_rect_template(c: Config, template_i: int, end: bool) -> str:
    animations = ""

    random_states = [random() < c.P for _ in range(c.R)] + [False]
    random_data = []
    true_last = False
    begin_last = 0

    for i, state in enumerate(random_states):
        if true_last and state:
            continue
        elif not true_last and state:
            begin_last = i
            true_last = True
        elif true_last and not state:
            true_last = False
            random_data.append((begin_last, i))
        elif not true_last and not state:
            continue

    for (ibegin, iend) in random_data:
        animations += (
            f'<animate attributename="fill"to="{c.PURPLE}"dur="{c.D / 1000}s"begin="{(c.D * ibegin) / 1000}s"fill="freeze"/>'
            f'<animate attributename="fill"to="{c.WHITE}"dur="{c.D / 1000}s"begin="{(c.D * iend) / 1000}s"fill="freeze"/>'
        )
    
    if end:
        animations += f'<animate attributename="fill"to="{c.BLACK}"dur="{c.D * 2 / 1000}s"begin="{(c.D * c.R) / 1000}s"fill="freeze"/>'

    idbase = "e" if end else "r"
    return (
            f'<rect id="{idbase}{template_i}"width="{c.CW}"height="{c.CH}"fill="{c.WHITE}"stroke="{c.BLACK}">'
            f'{animations}'
            f'</rect>'
            )

def create_defs(c: Config) -> str:
    defs = ""
    for i in range(c.TEMPLATE_COUNT):
        defs += create_rect_template(c, i, False)
    for j in range(c.END_TEMPLATE_COUNT):
        defs += create_rect_template(c, j, True)

    return (
            '<defs>'
            f'{defs}'
            '</defs>'
            )

def create_uses(c: Config) -> tuple[str, str, str, str, str]:
    a = '<use id="'
    b = '"x="'
    c = '"y="'
    d = '"href="#'
    e = '"/>'

    return a, b, c, d, e

'''
Text
'''

def create_text_template(c: Config) -> tuple[str, str]:
    font_size = (c.CH * 4) // 5
    x = c.TOTAL_WIDTH // 2

    a = f'<text font-family="monospace"text-anchor="middle"x="{x}"y="{c.TOTAL_HEIGHT}"width="{c.TOTAL_WIDTH}"font-size="{font_size}">#'
    b = f'</text>'

    return a, b

'''
Main wrapper
'''

def create_svg_wrap(c: Config) -> tuple[str, str]:
    a = f'<svg viewBox="0 0 {c.TOTAL_WIDTH} {c.TOTAL_HEIGHT}">'
    b = f'</svg>'

    return a, b

'''
Solidity contract
'''

# assumes template count and end template count < 256
def get_contract_code(c: Config) -> str:
    svg_a, svg_b = create_svg_wrap(c)
    text_a, text_b = create_text_template(c)
    defs = create_defs(c)
    uses_a, uses_b, uses_c, uses_d, uses_e = create_uses(c)

    return f'''pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Strings.sol";

contract GOLSVG {{
    uint256 constant W = {c.GW};
    uint256 constant H = {c.GH};
    uint256 constant CELL_W = {c.CW};
    uint256 constant CELL_H = {c.CH};
    uint256 constant TEMPLATE_COUNT = {c.TEMPLATE_COUNT};
    uint256 constant END_TEMPLATE_COUNT = {c.END_TEMPLATE_COUNT};

    using Strings for uint256;

    string constant SVG_A = \'{svg_a}\';
    string constant SVG_B = \'{svg_b}\';

    function svg(uint256 n, uint256 data) external pure returns (string memory) {{
        return string.concat(
            SVG_A,
            defs(),
            uses(n, data),
            text(n),
            SVG_B
        );
    }}

    string constant TEXT_A = \'{text_a}\';
    string constant TEXT_B = \'{text_b}\';

    function text(uint256 n) public pure returns (string memory) {{
        return string.concat(
            TEXT_A,
            n.toString(),
            TEXT_B
        );
    }}
    
    function defs() public pure returns (string memory) {{
        return \'{defs}\';
    }}
    
    string constant USES_A=\'{uses_a}\';
    string constant USES_B=\'{uses_b}\';
    string constant USES_C=\'{uses_c}\';
    string constant USES_D=\'{uses_d}\';
    string constant USES_E=\'{uses_e}\';

    function uses(uint256 n, uint256 data) public pure returns (string memory returnVal) {{
        uint256 rnd = uint256(keccak256(abi.encodePacked(n, data)));
        uint256 i = 0;
        
        for (uint256 x = 0; x < W; x++) {{
            for (uint256 y = 0; y < H; y++) {{
                returnVal = string.concat(
                    returnVal,
                    USES_A,
                    x.toString(),
                    "-",
                    y.toString(),
                    USES_B,
                    ((x + 1) * CELL_W).toString(),
                    USES_C,
                    ((y + 1) * CELL_H).toString(),
                    USES_D
                );

                bool isAlive = (data >> (y + x * H)) & 1 == 1;
                if (isAlive) {{
                    returnVal = string.concat(
                        returnVal,
                        "e",
                        (((rnd >> i) & 255) % END_TEMPLATE_COUNT).toString(),
                        USES_E
                    );
                }}
                else {{
                    returnVal = string.concat(
                        returnVal,
                        "r",
                        (((rnd >> i) & 255) % TEMPLATE_COUNT).toString(),
                        USES_E
                    );
                }}

                i++;
                i = i % 256;
            }} 
        }}
    }}
}}

'''
def main():
    initialize_env()
    c = default_config()

    with open('GOLSVG.sol', 'w') as f:
        f.write(get_contract_code(c))

if __name__ == "__main__":
    main()
