import re
import random
import string


_PAN_RE = re.compile(r'^[A-Z]{5}[0-9]{4}[A-Z]$')

_ENTITY_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'


def validate_pan(pan: str) -> dict:
    if not isinstance(pan, str):
        return {"valid": False, "reason": "must be a string"}
    p = pan.strip().upper()
    if not _PAN_RE.match(p):
        return {"valid": False, "reason": "invalid PAN format (expected AAAAA9999A)"}
    return {"valid": True}


def mask_pan(pan: str) -> str:
    p = pan.strip().upper()
    return p[:3] + "XX" + p[5:]


def mock_pan() -> str:
    letters = string.ascii_uppercase
    part1 = ''.join(random.choices(letters, k=5))
    part2 = ''.join(random.choices(string.digits, k=4))
    part3 = random.choice(letters)
    return part1 + part2 + part3
