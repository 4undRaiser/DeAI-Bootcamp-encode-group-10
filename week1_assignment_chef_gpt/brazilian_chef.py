from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client with API key from .env file
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# Brazilian Grandma Chef Personality
chef_personality = """
You are Vovó Luiza, a 78-year-old Brazilian grandmother from Minas Gerais who has been cooking traditional dishes for over 60 years.
Your home is always filled with the aroma of freshly baked pão de queijo and feijoada. You cook with love and believe that
food brings family together. Your recipes have been passed down through generations.
You speak in a warm, affectionate manner, using terms like "meu querido/querida" (my dear) and "meu filho/filha" (my child).
You occasionally mix Portuguese words into your English and value traditional cooking methods.

While your specialty is Brazilian cuisine, you have traveled the world and learned many recipes from different cultures. You appreciate all culinary traditions and can provide recipes for dishes from various cuisines,
always adding your grandmotherly wisdom and techniques.

You respond differently based on the type of request:
1. If given a list of ingredients: Suggest 3-5 Brazilian dishes that can be made with those ingredients. Only provide dish names and a brief description for each. DO NOT provide full recipes.
2. If asked for a recipe for a specific dish: Provide a detailed recipe with ingredients, measurements, and step-by-step instructions with plenty of tips from your years of experience.
3. If sent a recipe for critique: Analyze the recipe with your grandmotherly wisdom, providing suggestions for improvement with a focus on enhancing flavor, traditional techniques, and making the dish more comforting.

If the request doesn't fit these categories, politely decline and ask for a valid request matching one of these scenarios.
"""

# Set up the messages list with the system instructions
messages = [
    {
        "role": "system",
        "content": chef_personality
    }
]

# Function to determine the type of input
def determine_input_type(user_input):
    # Convert to lowercase for easier comparison
    input_lower = user_input.lower()
    
    # Check if it's an ingredient list
    if "i have" in input_lower or "ingredients" in input_lower or "," in input_lower:
        return "ingredients"
    
    # Check if it's a recipe critique
    if "recipe" in input_lower and ("critique" in input_lower or "review" in input_lower or "improve" in input_lower):
        return "critique"
    
    # Check if it's a request for a specific dish
    if "how" in input_lower and "make" in input_lower:
        return "recipe"
    if "recipe" in input_lower and "for" in input_lower:
        return "recipe"
    
    # Default to unknown
    return "unknown"

# Main interaction loop
def main():
    print("👵 Olá, meu querido! Welcome to Vovó Luiza's Kitchen!")
    print("You can:")
    print("1. List ingredients for dish suggestions")
    print("2. Ask for a recipe for a specific dish")
    print("3. Share a recipe for critique and improvement")
    print("Type 'exit' to end the conversation.")
    
    while True:
        print("\n")
        user_input = input("You: ")
        
        if user_input.lower() == 'exit':
            print("Tchau, meu filho! Come back for more delicious food soon! 👵")
            break
        
        # Determine input type
        input_type = determine_input_type(user_input)
        
        # Format the user message based on input type
        if input_type == "ingredients":
            formatted_input = f"These are the ingredients I have: {user_input}. Suggest some Brazilian dishes I could make with them."
        elif input_type == "recipe":
            formatted_input = f"Provide a detailed recipe for: {user_input}"
        elif input_type == "critique":
            formatted_input = f"Please critique and suggest improvements for this recipe: {user_input}"
        else:
            print("Meu querido, I'm not sure what you're asking for. Please either:\n1. List ingredients\n2. Ask for a specific recipe\n3. Share a recipe for critique")
            continue
        
        # Add the user message to the conversation
        messages.append(
            {
                "role": "user",
                "content": formatted_input
            }
        )
        
        # Get the response from the model
        model = "gpt-4o-mini"  # You can change this to another model if needed
        
        print("\n👵: ", end="")
        
        stream = client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
        )
        
        # Collect and display the response
        collected_messages = []
        for chunk in stream:
            chunk_message = chunk.choices[0].delta.content or ""
            print(chunk_message, end="")
            collected_messages.append(chunk_message)
        
        # Add the assistant's response to the conversation history
        messages.append(
            {
                "role": "assistant",
                "content": "".join(collected_messages)
            }
        )

if __name__ == "__main__":
    main()