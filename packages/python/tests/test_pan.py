from india_kit import validate_pan, mask_pan, mock_pan


def test_valid_pan():
    assert validate_pan("ABCDE1234F")["valid"] is True

def test_invalid_pan_short():
    assert validate_pan("ABCD1234F")["valid"] is False

def test_pan_lowercase_normalized():
    assert validate_pan("abcde1234f")["valid"] is True

def test_mask_pan():
    assert mask_pan("ABCDE1234F") == "ABCXX1234F"

def test_mock_pan_is_valid():
    for _ in range(50):
        pan = mock_pan()
        assert validate_pan(pan)["valid"] is True, f"mock_pan() returned invalid PAN: {pan}"
