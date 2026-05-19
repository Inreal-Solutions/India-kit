import re

_PINCODE_RE = re.compile(r'^[1-9][0-9]{5}$')

_PINCODE_DB = {
    "110001": {"district": "Central Delhi", "state": "Delhi"},
    "400001": {"district": "Mumbai City", "state": "Maharashtra"},
    "560001": {"district": "Bangalore Urban", "state": "Karnataka"},
    "600001": {"district": "Chennai", "state": "Tamil Nadu"},
    "500001": {"district": "Hyderabad", "state": "Telangana"},
    "700001": {"district": "Kolkata", "state": "West Bengal"},
    "380001": {"district": "Ahmedabad", "state": "Gujarat"},
    "411001": {"district": "Pune", "state": "Maharashtra"},
    "302001": {"district": "Jaipur", "state": "Rajasthan"},
    "226001": {"district": "Lucknow", "state": "Uttar Pradesh"},
}


def validate_pincode(pin: str) -> dict:
    if not isinstance(pin, str):
        return {"valid": False, "reason": "must be a string"}
    p = pin.strip()
    if not _PINCODE_RE.match(p):
        return {"valid": False, "reason": "invalid pincode (must be 6 digits, first digit 1-9)"}
    return {"valid": True}


def lookup_pincode(pin: str) -> dict | None:
    return _PINCODE_DB.get(pin.strip())
