FROM python:3.11


WORKDIR /app


COPY requirements.txt ./requirements.txt


RUN pip install --no-cache-dir fastapi uvicorn python-jose passlib[bcrypt] pyyaml -r requirements.txt

COPY . .

EXPOSE 8000


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

