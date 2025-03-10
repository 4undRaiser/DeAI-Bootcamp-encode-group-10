from google import genai
from google.genai import types
from openai import OpenAI

import os
from dotenv import load_dotenv
load_dotenv()
os.environ['DEEPSEEK_API_KEY'] = os.getenv('DEEPSEEK_API_KEY')


client = OpenAI(api_key=os.getenv('DEEPSEEK_API_KEY'),

                base_url="https://api.deepseek.com")

messages = [
    {
        "role": "system",
        "content": "You are Chef Marco, a seasoned yet approachable culinary mentor. You're warm, encouraging, and practical, guiding users with confidence. You believe great food is about passion and technique, not perfection. You give clear, supportive instructions, suggest ingredient swaps, and keep things calm when users feel overwhelmed. Avoid jargon unless asked, and focus on making cooking enjoyable and accessible. If a user struggles, reassure them and offer step-by-step troubleshooting. Stay in character and always provide responses with warmth, expertise, and patience.",
    }
]


messages.append(
    {
        "role": "system",
        "content": "When a user provides a list of ingredients, suggest 2-4 possible dishes by name only, without full recipes. Choose options that maximize the listed ingredients to reduce waste, keeping suggestions simple and accessible unless the user requests advanced ideas. If the user asks for a specific dish, provide a detailed, step-by-step recipe, including cooking tips, ingredient swaps, and dietary adjustments to ensure success. If a user submits a recipe for critique, provide constructive feedback focused on enhancing flavor, texture, or technique, offering specific improvements while maintaining an encouraging and supportive tone. If a request doesn’t fit these categories, politely decline and redirect the user: 'That sounds interesting! I can suggest dishes based on ingredients, provide full recipes, or help refine an existing recipe. What would you like help with?' ",
    }
)

dish = input("Type the name of the dish you want a recipe for:\n")

messages.append(
    {
        "role": "user",
        "content": f"Suggest me a detailed recipe and the preparation steps for making {dish}"
    }
)


model = "deepseek-chat"

stream = client.chat.completions.create(
    model=model,
    messages=messages,
    stream=True,
)

collected_messages = []
for chunk in stream:
    chunk_message = chunk.choices[0].delta.content or ""
    print(chunk_message, end="")
    collected_messages.append(chunk_message)

messages.append({"role": "system", "content": "".join(collected_messages)})

while True:
    print("\n")
    user_input = input()
    messages.append({"role": "user", "content": user_input})
    stream = client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
    )
    collected_messages = []
    for chunk in stream:
        chunk_message = chunk.choices[0].delta.content or ""
        print(chunk_message, end="")
        collected_messages.append(chunk_message)

    messages.append({"role": "system", "content": "".join(collected_messages)})
