from flask_marshmallow import Schema
from marshmallow.fields import Int, Float, Str


class AccidentSchema(Schema):
    class Meta:
        fields = [
            "Num_Acc", "grav", "sexe", "trajet", "an_nais",
            "num_veh", "senc", "catv", "obs", "obsm",
            "choc", "mois", "jour",  "lum", "agg", "int", "atm", "col",
            "lat", "longi", "dep", "Year", "catr", "circ", "vosp", "prof", "plan", "surf", "infra", "situ", "tranche_age"
        ]

    Num_Acc = Int()
    grav = Int()
    sexe = Int()
    trajet = Int()
    an_nais = Float()
    num_veh = Str()
    senc = Float()
    catv = Int()
    obs = Float()
    obsm = Float()
    choc = Float()
    mois = Int()
    jour = Int()
    lum = Int()
    agg = Int()
    int = Int()
    atm = Int()
    col = Float()
    lat = Str()
    longi = Str()
    dep = Int()
    Year = Int()
    catr = Int()
    circ = Float()
    vosp = Float()
    prof = Float()
    plan = Float()
    surf = Float()
    infra = Str()
    situ = Str()
    tranche_age = Str()
