from india_kit import (
    validate_gstin, mock_gstin,
    validate_ifsc, lookup_ifsc,
    validate_upi,
    validate_pincode, lookup_pincode,
    split_gst,
)


def test_valid_gstin():
    g = mock_gstin()
    assert len(g) == 15

def test_invalid_gstin():
    assert validate_gstin("INVALID")["valid"] is False

def test_valid_ifsc():
    assert validate_ifsc("SBIN0000001")["valid"] is True

def test_invalid_ifsc():
    assert validate_ifsc("SBI001")["valid"] is False

def test_lookup_ifsc():
    result = lookup_ifsc("SBIN0000001")
    assert result is not None
    assert result["bank"] == "State Bank of India"

def test_lookup_ifsc_missing():
    assert lookup_ifsc("XXXX0000000") is None

def test_valid_upi():
    assert validate_upi("alice@icici")["valid"] is True
    assert validate_upi("bob.smith@upi")["valid"] is True

def test_invalid_upi():
    assert validate_upi("@icici")["valid"] is False
    assert validate_upi("alice@")["valid"] is False

def test_valid_pincode():
    assert validate_pincode("110001")["valid"] is True

def test_invalid_pincode():
    assert validate_pincode("011001")["valid"] is False
    assert validate_pincode("11001")["valid"] is False

def test_lookup_pincode():
    result = lookup_pincode("110001")
    assert result is not None
    assert result["state"] == "Delhi"

def test_split_gst_intra():
    result = split_gst(1000, 18, intra_state=True)
    assert result["cgst"] == 90.0
    assert result["sgst"] == 90.0
    assert result["igst"] == 0.0
    assert result["total_tax"] == 180.0

def test_split_gst_inter():
    result = split_gst(1000, 18, intra_state=False)
    assert result["cgst"] == 0.0
    assert result["sgst"] == 0.0
    assert result["igst"] == 180.0
    assert result["total_tax"] == 180.0
