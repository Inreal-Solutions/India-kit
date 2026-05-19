# india-kit

The definitive Indian developer toolkit for Python. Validate Aadhaar, PAN, GSTIN, IFSC, UPI, pincode and more — zero dependencies, fully typed.

## Install

```bash
pip install india-kit
```

## Usage

```python
from india_kit import (
    validate_pan, mask_pan, mock_pan,
    validate_aadhaar, mock_aadhaar,
    validate_gstin, mock_gstin,
    validate_ifsc, lookup_ifsc,
    validate_upi,
    validate_pincode, lookup_pincode,
    split_gst,
)

validate_pan("ABCDE1234F")      # {"valid": True}
validate_aadhaar("234123412346") # {"valid": True/False}
validate_gstin("27ABCDE1234F1Z5") # {"valid": True/False}
validate_ifsc("SBIN0000001")    # {"valid": True}
validate_upi("alice@icici")     # {"valid": True}
validate_pincode("110001")      # {"valid": True}

lookup_ifsc("SBIN0000001")      # {"bank": "State Bank of India", ...}
lookup_pincode("110001")        # {"district": "Central Delhi", "state": "Delhi"}

split_gst(1000, 18)             # {"cgst": 90.0, "sgst": 90.0, "igst": 0.0, "total_tax": 180.0}
split_gst(1000, 18, intra_state=False)  # {"cgst": 0.0, "sgst": 0.0, "igst": 180.0, ...}

mask_pan("ABCDE1234F")          # "ABCXX1234F"
mock_pan()                      # random valid PAN
mock_aadhaar()                  # random valid Aadhaar
```

## License

MIT
