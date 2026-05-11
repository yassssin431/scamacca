# Commandes pour lancer le projet (cote partenaire)

## Frontend (React + Electron)

Terminal 1 :

```bash
cd frontend
npm install
npm run dev        # demarre Vite
```

Terminal 2 :

```bash
cd frontend
npm run electron   # demarre Electron
```

Commande pour installer Electron explicitement :

```bash
npm install electron@29 --save-dev
```

Notes :
- `npm run dev` demarre Vite sur `http://localhost:5173/`.
- `npm run electron` ouvre l'application desktop Electron et charge ce serveur Vite.
- Lancez `npm run dev` avant `npm run electron`.
- Le terminal Vite doit rester ouvert. Si le prompt PowerShell revient, le serveur Vite n'est plus actif.

## Backend API (Node + Express)

```bash
cd backend
npm install
npm run dev        # demarre l'API avec nodemon
```

Alternative production :

```bash
cd backend
npm start
```

## Alertes email IA

Les emails d'anomalies sont envoyes automatiquement par le scheduler IA quand `EMAIL_ALERTS_ENABLED=true`.
Si `ALERT_RECIPIENTS` est vide, le backend envoie aux utilisateurs actifs Admin et Finance.

Variables a ajouter dans `backend/.env` :

```bash
EMAIL_ALERTS_ENABLED=true
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=alerts@example.com
SMTP_PASS=mot_de_passe_smtp
ALERT_EMAIL_FROM="Tradrly Alerts <alerts@example.com>"
ALERT_RECIPIENTS=admin@example.com,finance@example.com
AI_SERVICE_URL=http://localhost:5001
```

Test admin protege :

```bash
POST http://localhost:7777/api/ai/alerts/test-email
Authorization: Bearer <token_admin>
```

## Backend AI (Python)

```bash
cd backend/ai-service
pip install Flask pandas numpy SQLAlchemy psycopg2-binary scikit-learn statsmodels joblib scipy python-dateutil tzdata
python app.py
```

Alternative recommandee avec le fichier `requirements.txt` :

```bash
cd backend/ai-service
pip install -r requirements.txt
python app.py
```

## Donnees de test pour les endpoints ML

Option recommandee : ajouter des donnees fake dans les vraies tables business PostgreSQL (`Invoices`, `Expenses`, etc.), puis lancer l'ETL pour remplir `FactRevenues` et `FactExpenses`.

```bash
cd backend
node seeders/seedMlBusinessData.js
node etl/runETL.js
```

Ce seeder ajoute 24 mois de factures et depenses. Les revenus ont une tendance claire, et deux depenses sont volontairement tres hautes pour tester les anomalies.

Option rapide : remplacer directement les tables analytiques `FactRevenues` et `FactExpenses` par 24 mois de donnees variees.

```bash
psql -U postgres -d tradrly_db -f backend/seeders/mlTestData.sql
```

Ensuite, relancez le service Python et testez :

```bash
http://127.0.0.1:5001/ml/forecast/revenue
http://127.0.0.1:5001/ml/arima/revenue
http://127.0.0.1:5001/ml/anomalies/expenses
```

## Backend AI (Docker)

```bash
cd backend/ai-service
docker build -t ai-service .
docker run -p 5001:5001 ai-service
```
