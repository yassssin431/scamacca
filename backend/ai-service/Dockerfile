# Utilise l’image officielle Python
FROM python:3.13

# Définit le dossier de travail dans le container
WORKDIR /app

# Copie le fichier requirements.txt
COPY requirements.txt .

# Installe toutes les dépendances
RUN pip install -r requirements.txt

# Copie tout le code dans le container
COPY . .

# Expose le port Flask
EXPOSE 5001

# Lance l’application
CMD ["python", "app.py"]
