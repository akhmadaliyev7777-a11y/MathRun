"""Kasrlarni tartiblash o'yini (poyezd) uchun topshiriqlar — qayta ishlatish xavfsiz (doimiy urug').

  4-sinf 43-mavzu (g4_c3_b43_l2): maxrajlari bir xil kasrlar, 20 ta (ba'zilarida noto'g'ri kasr ham bor).
  4-sinf 46-mavzu (g4_c3_b46_l3): 1-mashq — maxrajlari bir xil (10), 2-mashq — suratlari bir xil (10).

Topshiriq: {"id", "prompt", "ascending", "kasrlar": [[surat, maxraj], ...], "tur": "maxraj" | "surat"}.
Har topshiriqda kasrlar qiymati har xil, shart (bir xil maxraj / surat) bajarilgani tekshiriladi.
Ishga tushirish: python3 tools/gen_kasr_tartib.py
"""
import json, os, random
from fractions import Fraction

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANKS = os.path.join(ROOT, "data", "banks")
YON = {True: "o'sish", False: "kamayish"}


def maxraj_bir_xil(rnd, notogri=False):
    d = rnd.randint(5, 12)                          # to'g'ri kasrlar uchun kamida 4 ta surat bo'lsin
    k = rnd.choice([4, 5]) if d >= 7 else 4
    top = d + 4 if notogri else d - 1
    nums = rnd.sample(range(1, top + 1), k)
    if notogri and all(n < d for n in nums):        # kamida bitta noto'g'ri kasr bo'lsin
        nums[0] = rnd.randint(d + 1, top)
        if len(set(nums)) < k:
            return None
    return [[n, d] for n in nums]


def surat_bir_xil(rnd):
    n = rnd.randint(1, 5)
    k = rnd.choice([4, 5])
    dens = rnd.sample(range(n + 1, 13), k)           # to'g'ri kasrlar: maxraj suratdan katta
    return [[n, d] for d in dens]


def yasash(rnd, tur, son, asc_bosh, notogri_ulush=0.0, prefix=""):
    out, seen = [], set()
    while len(out) < son:
        if tur == "maxraj":
            kk = maxraj_bir_xil(rnd, notogri=rnd.random() < notogri_ulush)
        else:
            kk = surat_bir_xil(rnd)
        if not kk:
            continue
        key = tuple(sorted(map(tuple, kk)))
        if key in seen:
            continue
        seen.add(key)
        asc = (len(out) % 2 == 0) == asc_bosh
        nom = "Maxrajlari bir xil" if tur == "maxraj" else "Suratlari bir xil"
        out.append({
            "id": f"{prefix}{len(out) + 1:02d}", "tur": tur, "ascending": asc,
            "prompt": f"{nom} kasrlarni {YON[asc]} tartibida joylashtiring",
            "kasrlar": kk,
        })
    return out


def tekshir(tasks):
    for t in tasks:
        vals = [Fraction(n, d) for n, d in t["kasrlar"]]
        assert len(set(vals)) == len(vals), t
        if t["tur"] == "maxraj":
            assert len({d for _, d in t["kasrlar"]}) == 1, t
        else:
            assert len({n for n, _ in t["kasrlar"]}) == 1, t
            assert all(n < d for n, d in t["kasrlar"]), t
        assert 4 <= len(vals) <= 5, t


def main():
    rnd = random.Random(2026_10_30)
    b43 = yasash(rnd, "maxraj", 20, True, notogri_ulush=0.35, prefix="g4c3b43l2_kasr_")
    b46 = yasash(rnd, "maxraj", 10, True, prefix="g4c3b46l3_maxraj_") + yasash(rnd, "surat", 10, True, prefix="g4c3b46l3_surat_")
    for tasks in (b43, b46):
        tekshir(tasks)
    for name, tasks in (("g4_c3_b43_l2_tasks.json", b43), ("g4_c3_b46_l3_tasks.json", b46)):
        with open(os.path.join(BANKS, name), "w", encoding="utf-8") as f:
            json.dump(tasks, f, ensure_ascii=False, indent=1)
        print(name, len(tasks), "ta topshiriq")


if __name__ == "__main__":
    main()
