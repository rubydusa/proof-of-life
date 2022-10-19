from random import random
from random import randrange

R = 12
P = 0.4
D = 200

W = 8
H = 8
CELL_W = 10
CELL_H = 10

TEMPLATE_COUNT = 8

WHITE = "#fff"
BLACK = "#111"
PURPLE = "#7232f2"

def create_rect_template(template_i):
    animations = ""

    random_states = [random() < P for _ in range(R - 1)] + [False]
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
            f'<animate attributename="fill" from="{WHITE}" to="{PURPLE}" dur="{D / 1000}s" begin="{(D * ibegin) / 1000}s" fill="freeze"/>'
            f'<animate attributename="fill" from="{PURPLE}" to="{WHITE}" dur="{D / 1000}s" begin="{(D * iend) / 1000}s" fill="freeze"/>'
        )

    return (
            f'<rect id="r{template_i}" width="{CELL_W}" height="{CELL_H}" fill="{WHITE} "stroke="{BLACK}">'
            f'{animations}'
            f'</rect>'
            )

def get_svg():
    defs = ""
    for i in range(TEMPLATE_COUNT):
        defs += create_rect_template(i)

    defs = (
            '<defs>'
            f'{defs}'
            '</defs>'
            )

    uses = ""
    for x in range(W):
        for y in range(H):
            uses += f'<use id="{x}-{y}" x="{(x + 1) * CELL_W}" y="{(y + 1) * CELL_H}" href="#r{randrange(TEMPLATE_COUNT)}"/>'

    svg = (
            f'<svg viewBox="0 0 {(W + 2) * CELL_W} {(H + 2) * CELL_H}">'
            f'{defs}'
            f'{uses}'
            '</svg>'
            )

    return svg

def main():
    svg = get_svg()
    with open("golres.svg", "w") as f:
        f.write(svg)
    with open("golres_hex", "w") as f:
        hexdata = svg.encode('utf-8').hex()
        hexdata = [hexdata[(i*2):(i*2)+2] for i in range(len(hexdata) // 2)]
        hexdata_sep = ""

        for code in hexdata:
            hexdata_sep += "\\x"
            hexdata_sep += code

        f.write(hexdata_sep)
if __name__ == "__main__":
    main()
