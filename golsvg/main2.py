from random import random, randrange, shuffle, seed
from xml.etree import ElementTree
import xml.etree.ElementTree as gfg
from dataclasses import dataclass

SEED = 0

@dataclass(frozen=True)
class Config:
    R: int  # animation rounds
    D: int  # duration (in milliseconds)
    P: float  # probability

    GW: int  # grid width (how many cells, horizontally)
    GH: int  # grid height (how many cells, vertically)
    CW: int  # cell width (how many units width per cell, used to control stroke width)
    CH: int  # cell height (how many units height per cell, used to control stroke width)

    REGULAR_TEMPLATE_COUNT: int
    END_TEMPLATE_COUNT: int
    BACKGROUND: str
    END: str
    TRANSITION: str

    @property
    def TOTAL_WIDTH(self):
        return self.CW * (self.GW + 2)

    @property
    def TOTAL_HEIGHT(self):
        return self.CH * (self.GH + 2)

    @staticmethod
    def DEFAULT():
        return Config(
            12,
            5000,
            0.4,
            8,
            8,
            10,
            10,
            32,
            16,
            "#fff",
            "#000",
            "#7232f2"
        )

# make generation determinstic
def initialize_env() -> None:
    seed(SEED)

"""
Template Generation
"""
def state_index_to_precent(x: int, rounds: int) -> str:
    return f"{round(x / (rounds + 1) * 100, 2):g}%"

def remove_consecutives(l: list[int]) -> list[int]:
    """
    remove in-betweens of consecutive sequences:

    0 1 2 4 5 6 9 ->
    0 - 2 4 - 6 9
    """
    if len(l) <= 2:
        return l

    result = [l[0]]
    for x, y, z in zip(l, l[1:], l[2:]):
        if not (y - x == 1 and z - y == 1):
            result.append(y)
    result.append(l[-1])
    return result

def generate_rounds(rounds: int, p: float) -> list[bool]:
    """
    True - transition state
    False - background state

    Must have at least one transition state
    """
    return [True] + [random() < p for _ in range(rounds - 1)]

def generate_states(rounds: int, probability: float) -> tuple[list[int], list[int]]:
    transition_states: list[int] = []
    background_states: list[int] = [0]

    shuffled_rounds = generate_rounds(rounds, probability)
    shuffle(shuffled_rounds)

    for i, is_transition in enumerate(shuffled_rounds):
        if is_transition:
            transition_states.append(i + 1)
        else:
            background_states.append(i + 1)

    return transition_states, background_states

def generate_template(index: int, is_end: bool, config: Config) -> str:
    """
    --t = transition color
    --b = background color
    --e = end color
    """
    transition_states, background_states = generate_states(config.R, config.P)

    transition_precentages = list(
        map(
            lambda x: state_index_to_precent(x, config.R),
            remove_consecutives(transition_states)
        )
    )
    background_precentages = list(
        map(
            lambda x: state_index_to_precent(x, config.R),
            remove_consecutives(background_states)
        )
    )

    end_str = ""
    if is_end:
        end_str = "100% {fill: var(--e)}"
    else:
        background_precentages.append("100%")

    animation_name = f"{'e' if is_end else 'r'}{index}"
    keyframes = (
        f"@keyframes {animation_name} {{"
        f"{','.join(transition_precentages)} {{fill: var(--t)}}"
        f"{','.join(background_precentages)} {{fill: var(--b)}}"
        f"{end_str}"
        "}"
    )
    
    css_class = (
        f".{animation_name} {{"
        f"animation: {animation_name} {round(config.D / 1000, 2):g}s ease-in 0s normal 1 forwards"
        "}"
    )

    return ' '.join([keyframes, css_class])

def generate_templates(config: Config) -> str:
    templates = \
        [generate_template(i, False, config) for i in range(config.REGULAR_TEMPLATE_COUNT)] + \
        [generate_template(i, True, config) for i in range(config.END_TEMPLATE_COUNT)]

    return ' '.join(templates)

def generate_style(config: Config) -> str:
    style = gfg.Element("style")
    style.set("type", "text/css")

    text = [
        (
            ":root {"
            f"--t: {config.TRANSITION};"
            f"--b: {config.BACKGROUND};"
            f"--e: {config.END}"
            "}"
            ""
        ),
        (
            "rect {"
            "fill: var(--b);"
            "stroke: var(--e);"
            f"width: {config.CW}px;"
            f"height: {config.CH}px"
            "}"
            ""
        ),
        (
            "text {"
            f"color: {config.END}"
            "}"
        ),
        generate_templates(config)
    ]

    style.text = ' '.join(text)
    return ElementTree.tostring(style).decode()

"""
SVG fragments generation
"""
def create_rect_frags() -> tuple[str, str, str, str, str]:
    a = '<rect id="'
    b = '" x="'
    c = '" y="'
    d = '" class="'
    e = '"/>'

    return a, b, c, d, e

def create_text_frags(config: Config) -> tuple[str, str]:
    font_size = (config.CH * 4) // 5
    x = config.TOTAL_WIDTH // 2

    a = f'<text font-family="monospace" text-anchor="middle" x="{x}" y="{config.TOTAL_HEIGHT}" width="{config.TOTAL_WIDTH}" font-size="{font_size}">#'
    b = f'</text>'

    return a, b

def create_svg_frags(config: Config) -> tuple[str, str]:
    a = f'<svg viewBox="0 0 {config.TOTAL_WIDTH} {config.TOTAL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">'
    b = f'</svg>'

    return a, b

"""
Contract Generation
"""

def get_contract_code(config: Config) -> str:
    rect_a, rect_b, rect_c, rect_d, rect_e = create_rect_frags()
    text_a, text_b = create_text_frags(config)
    svg_a, svg_b = create_svg_frags(config)
    style = generate_style(config)

    return f'''pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract GOLSVG {{
    using Strings for uint256;

    uint256 constant W = {config.GW};
    uint256 constant H = {config.GH};
    uint256 constant CELL_W = {config.CW};
    uint256 constant CELL_H = {config.CH};
    uint256 constant REGULAR_TEMPLATE_COUNT = {config.REGULAR_TEMPLATE_COUNT};
    uint256 constant END_TEMPLATE_COUNT = {config.END_TEMPLATE_COUNT};

    string constant RECT_A = \'{rect_a}\';
    string constant RECT_B = \'{rect_b}\';
    string constant RECT_C = \'{rect_c}\';
    string constant RECT_D = \'{rect_d}\';
    string constant RECT_E = \'{rect_e}\';
    string constant TEXT_A = \'{text_a}\';
    string constant TEXT_B = \'{text_b}\';
    string constant SVG_A = \'{svg_a}\';
    string constant SVG_B = \'{svg_b}\';
    string constant STYLE = \'{style}\';

    function svg(uint256 n, uint256 data) external pure returns (bytes memory) {{
        uint256 rnd = uint256(keccak256(abi.encodePacked(n, data)));
        uint256 i = 0;
        
        bytes memory rects = "";
        for (uint256 x = 0; x < W; x++) {{
            for (uint256 y = 0; y < H; y++) {{
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
                if (isAlive) {{
                    rects = abi.encodePacked(
                        rects,
                        "e",
                        (((rnd >> i) & 255) % END_TEMPLATE_COUNT).toString(),
                        RECT_E
                    );
                }}
                else {{
                    rects = abi.encodePacked(
                        rects,
                        "r",
                        (((rnd >> i) & 255) % REGULAR_TEMPLATE_COUNT).toString(),
                        RECT_E
                    );
                }}

                i++;
                i = i % 256;
            }} 
        }}

        return abi.encodePacked(
            SVG_A,
            STYLE,
            rects,
            TEXT_A,
            n.toString(),
            TEXT_B,
            SVG_B
        );
    }}
}}

'''

def main():
    config = Config.DEFAULT()
    with open("GOLSVG.sol", "w") as f:
        f.write(get_contract_code(config))

if __name__ == "__main__":
    main()
