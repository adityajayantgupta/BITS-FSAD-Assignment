from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import GenerationFunction
import uvicorn
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def main():
    return {"message": "Hello World"}

@app.get("/v1/ask")
def generate_response(ingredients:str,time:str,type:str):
    print("Inside response generating")
    user_input = {"ingredients":ingredients,"type":type,"time":time}
    try:
        print(user_input)
        answer = GenerationFunction(user_input)
        print("Got the answer")
    except Exception as e:
        answer = "Token error, Try after some time."
    return {"answer": answer}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)