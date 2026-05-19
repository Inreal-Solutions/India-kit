def split_gst(amount: float, rate_percent: float, intra_state: bool = True) -> dict:
    total_tax = round(amount * rate_percent / 100, 2)
    if intra_state:
        half = round(total_tax / 2, 2)
        return {"cgst": half, "sgst": half, "igst": 0.0, "total_tax": total_tax}
    return {"cgst": 0.0, "sgst": 0.0, "igst": total_tax, "total_tax": total_tax}
