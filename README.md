# energy-fraud-detection

### Dataset Link

https://drive.google.com/drive/folders/120wz7TA3F_LKeEiqkxvQC1q8535HITAb?usp=drive_link

### Creating Virtual Environment 

```bash
conda create --name capstone 
```

### Installing Dependencies

```bash
cd backend && pip install -r requirements.txt 
```

```bash
cd frontend && npm i
```

### Creating .env for Backend

```bash
echo -e "SECRET_KEY=\nEMAIL_HOST_USER=\nEMAIL_HOST_PASSWORD=\nPOSTGRES_USER=\nPOSTGRES_PASSWORD=\nPOSTGRES_HOST=" > ./backend/.env
```

### Creating .env for Frontend

```bash
echo -e "REACT_APP_API_URL =" > ./frontend/.env
```

### Activating Virtual Environment 

```bash
conda activate casptone
```

### Running Backend Server

```bash
cd backend && python manage.py runserver
```

### Creating Build Files

```bash
cd frontend && npm run build
```

### Running React App

```bash
cd frontend && npm run start
```

