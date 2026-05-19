import re

_UPI_RE = re.compile(r'^[a-zA-Z0-9._+%\-]{2,}@[a-zA-Z]{2,}$')


def validate_upi(vpa: str) -> dict:
    if not isinstance(vpa, str):
        return {"valid": False, "reason": "must be a string"}
    if not _UPI_RE.match(vpa.strip()):
        return {"valid": False, "reason": "invalid UPI VPA format (expected localpart@bank)"}
    return {"valid": True}
