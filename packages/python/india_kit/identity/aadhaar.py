import random

_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]

_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]


def _verhoeff_check(number: str) -> bool:
    c = 0
    for i, ch in enumerate(reversed(number)):
        c = _D[c][_P[i % 8][int(ch)]]
    return c == 0


def _verhoeff_checksum(number: str) -> int:
    c = 0
    padded = number + "0"
    for i, ch in enumerate(reversed(padded)):
        c = _D[c][_P[i % 8][int(ch)]]
    return _INV[c]


def validate_aadhaar(aadhaar: str) -> dict:
    if not isinstance(aadhaar, str):
        return {"valid": False, "reason": "must be a string"}
    a = aadhaar.strip().replace(" ", "")
    if not a.isdigit() or len(a) != 12:
        return {"valid": False, "reason": "must be exactly 12 digits"}
    if a[0] in "01":
        return {"valid": False, "reason": "first digit cannot be 0 or 1"}
    if not _verhoeff_check(a):
        return {"valid": False, "reason": "invalid Verhoeff checksum"}
    return {"valid": True}


def mock_aadhaar() -> str:
    while True:
        first = str(random.randint(2, 9))
        rest = ''.join([str(random.randint(0, 9)) for _ in range(10)])
        base = first + rest
        check = _verhoeff_checksum(base)
        candidate = base + str(check)
        if _verhoeff_check(candidate):
            return candidate
