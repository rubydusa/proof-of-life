from random import random, shuffle

'''
def num2grid(num: int, width: int, height: int) -> list[list[int]]:
    return [
        [(num >> (y + x * height)) & 1 for y in range(height)]
        for x in range(width)
    ]
'''

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

def generate_template(index: int, is_end: bool, rounds: int, probability: float, duration: int) -> str:
    """
    --t = transition color
    --b = background color
    --e = end color
    """
    transition_states, background_states = generate_states(rounds, probability)

    def state_index_to_precent(x):
        return f"{round(x / (rounds + 1) * 100, 2):g}%"

    transition_precentages = list(
        map(
            state_index_to_precent,
            remove_consecutives(transition_states)
        )
    )
    background_precentages = list(
        map(
            state_index_to_precent,
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
            f"animation: {animation_name} {duration}s ease-in 0s normal 1 forwards"
            "}"
            )

    return ' '.join([keyframes, css_class])

def generate_templates(rtemplates: int, etemplates: int, rounds: int, probability: float, duration: int):
    templates = \
        [generate_template(i, False, rounds, probability, duration) for i in range(rtemplates)] + \
        [generate_template(i, True, rounds, probability, duration) for i in range(etemplates)]

    return ' '.join(templates)

def main():
    pass

if __name__ == "__main__":
    main()
