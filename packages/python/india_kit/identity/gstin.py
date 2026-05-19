import re
import random
import string
from .pan import validate_pan, mock_pan


_GSTIN_RE = re.compile(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$')

_STATE_CODES = [
    "01","02","03","04","05","06","07","08","09","10",
    "11","12","13","14","15","16","17","18","19","20",
    "21","22","23","24","25","26","27","28","29","30",
    "31","32","33","34","35","36","37",
]


def validate_gstin(gstin: str) -> dict:
    if not isinstance(gstin, str):
        return {"valid": False, "reason": "must be a string"}
    g = gstin.strip().upper()
    if not _GSTIN_RE.match(g):
        return {"valid": False, "reason": "invalid GSTIN format"}
    embedded_pan = g[2:12]
    result = validate_pan(embedded_pan)
    if not result["valid"]:
        return {"valid": False, "reason": "embedded PAN is invalid"}
    return {"valid": True}


def mock_gstin() -> str:
    state = random.choice(_STATE_CODES)
    pan = mock_pan()
    entity = str(random.randint(1, 9))
    checksum = random.choice(string.digits + string.ascii_uppercase)
    return state + pan + entity + "Z" + checksum
