from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from auth import auth_router
import yaml
import random
import os
import uuid
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

QUESTIONS = []
RESULTS_FILE = "results.json"

class AnswerRequest(BaseModel):
    answers: dict

class Result(BaseModel):
    session_id: str
    correct: int
    total: int

def load_questions():
    global QUESTIONS
    QUESTIONS = []
    for file in os.listdir("questions"):
        if file.endswith(".yaml"):
            with open(os.path.join("questions", file), "r") as f:
                QUESTIONS.extend(yaml.safe_load(f))

@app.on_event("startup")
def startup_event():
    load_questions()

@app.get("/questions/random")
def get_random_questions(count: int = 5):
    return random.sample(QUESTIONS, min(count, len(QUESTIONS)))

app.include_router(auth_router)

@app.post("/submit", response_model=Result)
def submit_answers(data: AnswerRequest):
    correct = 0
    total = 0
    for q in QUESTIONS:
        qid = str(q["id"])
        if qid in data.answers:
            total += 1
            if q["answer"] == data.answers[qid]:
                correct += 1
    session_id = str(uuid.uuid4())
    result = {"session_id": session_id, "correct": correct, "total": total}
    try:
        with open(RESULTS_FILE, "a") as f:
            f.write(json.dumps(result) + "\n")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return result
