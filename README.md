# energy-fraud-detection

### Dataset Link

https://drive.google.com/drive/folders/120wz7TA3F_LKeEiqkxvQC1q8535HITAb?usp=drive_link

### Creating Virtual Environment 

```bash
conda create --name capstone --file backend/requirements.txt
```

### Installing Dependencies

```bash
npm i
```

### Creating .env for Backend

```bash
cat <<EOL > backend/.env
SECRET_KEY=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
EOL
```

### Creating .env for Frontend

```bash
cat <<EOL > frontend/.env
REACT_APP_API_URL =
EOL
```

### Activating Virtual Environment 

```bash
conda activate casptone
```

### Running Backend Server

```bash
python manage.py runserver
```

### Creating Build Files

```bash
npm run build
```

### Running React App

```bash
npm run start
```

