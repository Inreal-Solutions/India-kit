import re

_IFSC_RE = re.compile(r'^[A-Z]{4}0[A-Z0-9]{6}$')

_IFSC_DB = {
    "SBIN0000001": {"bank": "State Bank of India", "branch": "Mumbai Main", "city": "Mumbai"},
    "HDFC0000002": {"bank": "HDFC Bank", "branch": "Delhi Main", "city": "Delhi"},
    "ICIC0000003": {"bank": "ICICI Bank", "branch": "Bangalore Main", "city": "Bangalore"},
    "AXIS0000004": {"bank": "Axis Bank", "branch": "Chennai Main", "city": "Chennai"},
    "KKBK0000005": {"bank": "Kotak Mahindra Bank", "branch": "Pune Main", "city": "Pune"},
}


def validate_ifsc(ifsc: str) -> dict:
    if not isinstance(ifsc, str):
        return {"valid": False, "reason": "must be a string"}
    i = ifsc.strip().upper()
    if not _IFSC_RE.match(i):
        return {"valid": False, "reason": "invalid IFSC format (expected AAAA0XXXXXX)"}
    return {"valid": True}


def lookup_ifsc(ifsc: str) -> dict | None:
    i = ifsc.strip().upper()
    return _IFSC_DB.get(i)
