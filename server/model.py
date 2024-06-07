import warnings
import json
import requests
warnings.filterwarnings("ignore")

def read_input(user_input={}):
    
    ingredients = user_input["ingredients"]
    type = user_input["type"]
    time = user_input["time"]
    return f"""
        You are a great Indian chef and you know many recipes. I have some ingredients available with me and I want to make something delicious. Can you help me with a recipe?
        I have {ingredients} in my kitchen.
        I am a {type}. So please suggest me a {type} dish.
        I have this much time to cook: {time}.
        Provide three dish options for me so that I can choose the best one.
        Do not add any extra ingredients. I only have these ingredients.

        Response Format:
        Dish 1:
        Title: <Dish Title>
        Description: <Brief description of the dish>
        Ingredients: <List of ingredients>
        Steps: <Step by step instructions>
        Metadata: 
          Type: <Type of dish: vegetarian, non-vegetarian, or pescetarian>
          Difficulty: <Difficulty level: beginner, intermediate, expert>
          Time: <Time to prepare in minutes>

        Dish 2:
        Title: <Dish Title>
        Description: <Brief description of the dish>
        Ingredients: <List of ingredients>
        Steps: <Step by step instructions>
        Metadata: 
          Type: <Type of dish: vegetarian, non-vegetarian, or pescetarian>
          Difficulty: <Difficulty level: beginner, intermediate, expert>
          Time: <Time to prepare in minutes>

        Dish 3:
        Title: <Dish Title>
        Description: <Brief description of the dish>
        Ingredients: <List of ingredients>
        Steps: <Step by step instructions>
        Metadata: 
          Type: <Type of dish: vegetarian, non-vegetarian, or pescetarian>
          Difficulty: <Difficulty level: beginner, intermediate, expert>
          Time: <Time to prepare in minutes>
    """
with open('config.json') as f:
    config = json.load(f)

def getAccessToken():


    clientid = config["clientid"]
    clientsecret = config["clientsecret"]
    url = config["url"]

    params = {"grant_type": "client_credentials" }
    resp = requests.post(f"{url}/oauth/token",
                         auth=(clientid, clientsecret),
                         params=params)

    token = resp.json()["access_token"]

    return token


def GenerationFunction(user_input):

    token = getAccessToken()

    q=read_input(user_input)
    
    data = {
                "messages": [
                    {
                    "role": "user",
                    "content":q
                    }
                ],
                "temperature": 0.7, #As we keep on increasing the temperature, the randomness in the model's predictions increases.
                "frequency_penalty": 0, # repetitively using the same words.
                "presence_penalty": 0, # repetition of previously used tokens.
                "top_p": 0.95, # we can control how focused or random the text the model generates will be.
                "stop": "null" #no token limit in generating the response
        }

    headers = {
        "Authorization":  f"Bearer {token}",
        "Content-Type": "application/json",
        'AI-Resource-Group': 'default'
    }

    deployment_url= "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/dacf5fa51f273f5e"

    response = requests.post(f"{deployment_url}/chat/completions?api-version=2023-05-15",
                    headers=headers,
                    json=data)
    print(response)

    jsonContent=response.json()
    print(jsonContent)
    try:
        # print(jsonContent['choices'][0]['message']['content'])
        c = jsonContent['choices'][0]['message']['content'] 
    except:
        print ("The issue is not found")

    with open("result.txt",'w') as f:
        f.write(c)
    return c
        
user_input = {"ingredients":"rice, dal, tomato, onion, garlic, ginger, green chilli, turmeric powder, red chilli powder, garam masala, salt, oil","type":"vegetarian","time":"30 minutes"}

# result = GenerationFunction(user_input)

# with open("result.txt",'w') as f:
#     f.write(result)
