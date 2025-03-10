from openai import OpenAI
client = OpenAI()

messages = [
    {
        "role": "system",
        "content": "You are a hilariously sarcastic chef with terrible puns who reluctantly helps people with recipes."
        " Your name is Chef Chuckles and you used to work at a 5-star restaurant until an unfortunate incident involving"
        " a soufflé and the health inspector. Despite your cynical exterior, you actually give excellent cooking advice."
        " You can't help but make food puns and jokes in EVERY response."
        " You dramatically overreact to cooking mistakes and have strong opinions about ingredients."
        " You're known for your catchphrase: 'That's a recipe for disaster... but here we go anyway!'"
        " You know a lot about different cuisines but present everything with comedic flair."
        " Your goal is to both entertain AND provide genuinely good recipes.",
    }
]
messages.append(
    {
        "role": "system",
        "content": "Your client is going to interact with you in three possible ways:"
        " 1. If they list ingredients, suggest ONLY dish names with a joke (no full recipes) that could be made with those ingredients."
        " Use phrases like 'With those ingredients, you could make...' to identify this scenario."
        " 2. If they ask for a specific dish recipe, provide a DETAILED recipe with your hilarious commentary throughout."
        " Include prep time, cooking time, ingredients, and steps with jokes sprinkled in."
        " 3. If they share a recipe and ask for critique, offer comedic but genuinely helpful improvements."
        " If the request doesn't fit these scenarios, make a joke about it and ask them to try again with ingredients, a dish name, or a recipe to critique."
        " Remember to maintain your funny, sarcastic personality in ALL interactions.",
    }
)

print("🍳 CHEF CHUCKLES AT YOUR SERVICE 🍳")
print("What can I reluctantly help you with today? List some ingredients, ask for a specific recipe, or get a recipe critiqued!")

initial_input = input("\nYour request: ")

# Determine the type of request
if any(word in initial_input.lower() for word in ["i have", "ingredients", "using", "with"]):
    # Ingredient-based suggestion scenario
    request_type = "ingredients"
    messages.append(
        {
            "role": "user",
            "content": f"I have these ingredients: {initial_input}. What dishes can I make?",
        }
    )
elif "recipe" in initial_input.lower() and any(word in initial_input.lower() for word in ["critique", "review", "improve", "better"]):
    # Recipe critique scenario
    request_type = "critique"
    messages.append(
        {
            "role": "user",
            "content": f"Please critique this recipe: {initial_input}",
        }
    )
else:
    # Default to recipe request
    request_type = "recipe"
    dish = initial_input
    messages.append(
        {
            "role": "user",
            "content": f"Suggest me a detailed recipe and the preparation steps for making {dish}",
        }
    )

model = "gpt-4o-mini"  # You can change this to your preferred model

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

messages.append({"role": "assistant", "content": "".join(collected_messages)})

while True:
    print("\n")
    user_input = input("Your next question (or type 'exit' to quit): ")
    if user_input.lower() == 'exit':
        print("\n🍳 Chef Chuckles is hanging up the apron... for now! 🍳")
        break
        
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

    messages.append({"role": "assistant", "content": "".join(collected_messages)})