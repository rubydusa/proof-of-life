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
        TEMPLATE_COUNT=16,
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
def create_rect_template(c: Config, template_i: int) -> str:
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

    return (
            f'<rect id="r{template_i}"width="{c.CW}"height="{c.CH}"fill="{c.WHITE}"stroke="{c.BLACK}">'
            f'{animations}'
            f'</rect>'
            )

def create_defs(c: Config) -> str:
    defs = ""
    for i in range(c.TEMPLATE_COUNT):
        defs += create_rect_template(c, i)

    return (
            '<defs>'
            f'{defs}'
            '</defs>'
            )

def create_uses(c: Config) -> str:
    uses = ""
    for x in range(c.GW):
        for y in range(c.GH):
            uses += f'<use id="{x}-{y}"x="{(x + 1) * c.CW}"y="{(y + 1) * c.CH}"href="#r{randrange(c.TEMPLATE_COUNT)}"/>'

    return uses

def create_grid(c: Config) -> str:
    grid = (
            f'{create_defs(c)}'
            f'{create_uses(c)}'
            )

    return grid

'''
End Animations
'''

def create_end_animation(c: Config) -> tuple[str, str]:
    a = f'<animate attributename="fill"to="{c.BLACK}"dur="{c.D * 2 / 1000}s"begin="{(c.D * c.R) / 1000}s"fill="freeze"xlink:href="#'
    b = f'"/>'
    
    return a, b

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

def get_contract_code(c: Config) -> str:
    grid = create_grid(c)
    svg_a, svg_b = create_svg_wrap(c)
    end_a, end_b = create_end_animation(c)
    text_a, text_b = create_text_template(c)

    return f'''pragma solidity ^0.8.12;

import "@openzeppelin/contracts/utils/Strings.sol";

contract GOLSVG {{
    using Strings for uint256;

    string constant SVG_A = \'{svg_a}\';
    string constant SVG_B = \'{svg_b}\';

    function svg(uint256 n, uint8[] calldata cells) external pure returns (string memory) {{
        return string.concat(
            SVG_A,
            grid(),
            end(cells),
            text(n),
            SVG_B
        );
    }}

    string constant END_A = \'{end_a}\';
    string constant END_B = \'{end_b}\';

    function end(uint8[] calldata cells) public pure returns (string memory) {{
        string memory accm = "";

        uint256 length = cells.length / 2;
        for (uint256 i = 0; i < length; i++) {{
            uint256 ii = i * 2;
            uint256 a = cells[ii];
            uint256 b = cells[ii + 1];

            accm = string.concat(
                accm,
                END_A,
                a.toString(),
                '-',
                b.toString(),
                END_B
            );
        }}

        return accm;
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

    function grid() public pure returns (string memory) {{
        return \'{grid}\';
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

