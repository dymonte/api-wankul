import requests
from bs4 import BeautifulSoup

import json




url = "https://collection-wankul.fr"


def load_terrain(elements : list, dico_elem : dict) -> dict:

    dico_elem["type"] = "terrain"

    

    dico_elem["rarity"]=elements[2].find_all("p")[1].text.replace("Raret\u00e9 : ", "")

    dico_elem["artist"]=elements[2].find_all("p")[2].text.replace("Artiste : ", "")

    dico_elem["drop"]=elements[2].find_all("p")[3].text.replace("Taux de drop : ", "").replace(" (calcul\u00e9 avec les donn\u00e9es du site) ", "")

    dico_elem["abilities"]=[]
    for abilities in elements[1].find_all("div"):
        
        dico_elem["abilities"].append(
            {"target":abilities.find("h3").text, "value":abilities.find("p").text})

    return dico_elem

def load_perso(elements : list, dico_elem : dict, i : int) -> dict:

    dico_elem["desc"]=elements[0].find("p").text

    dico_elem["type"] = "perso"

    dico_elem["rarity"]=elements[2].find_all("p")[1].text.replace("Raret\u00e9 : ", "")

    dico_elem["perso"]=elements[2].find_all("p")[2].text.replace("Personnage : ", "")

    dico_elem["artist"]=elements[2].find_all("p")[3].text.replace("Artiste : ", "")

    dico_elem["drop"]=elements[2].find_all("p")[4].text.replace("Taux de drop : ", "").replace(" (calcul\u00e9 avec les donn\u00e9es du site) ", "")


    if i==55:
        dico_elem["abilities"]=["Reprend en main un Terrain de votre d\u00e9fausse."]
    elif i==103:
        dico_elem["abilities"]=[]
    else:
        dico_elem["abilities"]=[elements[1].find("p").text] if i!=55 else "Reprenez en main un Terrain de votre d\u00e9fausse."


    return dico_elem

dic=[]
# Envoyer une requête GET à l'URL
for i in range(1, 181):
    dico_elem={}

    response = requests.get(url+"/carte/"+str(i))

    soup = BeautifulSoup(response.content, "html.parser")

    # Trouver toutes les balises <img>

    elements = soup.find_all(class_="cardPageInfoSection")

    dico_elem["id"]=i

    dico_elem["ref"]=elements[2].p.text.replace("R\u00e9f\u00e9rence : ", "")

    dico_elem["name"]=elements[0].h1.text



    dico_elem["img"]=url+soup.find(class_="cardPageImage").find("img")["src"]

    if elements[0].find("p")==None:
        load_terrain(elements, dico_elem)
    else:
        load_perso(elements, dico_elem, i)
    
    

    # dic[str(i)]=dico_elem

    dic.append(dico_elem)

    print(i)



with open('cards.json', 'w') as f:
    json.dump(dic, f, indent=4)



