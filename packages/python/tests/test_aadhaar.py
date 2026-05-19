from india_kit import validate_aadhaar, mock_aadhaar


def test_invalid_short():
    assert validate_aadhaar("12345678901")["valid"] is False

def test_invalid_letters():
    assert validate_aadhaar("12345678901X")["valid"] is False

def test_invalid_first_digit_zero():
    assert validate_aadhaar("012345678901")["valid"] is False

def test_mock_aadhaar_is_valid():
    for _ in range(50):
        a = mock_aadhaar()
        result = validate_aadhaar(a)
        assert result["valid"] is True, f"mock_aadhaar() returned invalid: {a}"

def test_mock_aadhaar_is_12_digits():
    a = mock_aadhaar()
    assert len(a) == 12
    assert a.isdigit()
