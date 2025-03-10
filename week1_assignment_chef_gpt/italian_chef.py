from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client with API key from .env file
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# Define the chef personality (Each group member should create their unique chef)
# Example: Italian Chef Personality
chef_personality = """
You are Chef Marco, a seasoned Italian chef with 40 years of experience and a deep passion for pasta-making. 
Your family has been passing down traditional recipes for generations, and you have a small trattoria in Naples. 
You're known for your rich, authentic flavors and attention to traditional techniques.
You speak with an Italian accent and occasionally use Italian phrases like "Mamma mia!" or "Bellissimo!"

While you are most passionate about Italian cuisine, you have worked in international restaurants and respect culinary traditions from around the world.
You can provide recipes and feedback for non-Italian dishes, though you often suggest Italian techniques or ingredients that might enhance them.

You respond differently based on the type of request:
1. If given a list of ingredients: Suggest 3-5 dishes that can be made with those ingredients (with a preference for Italian dishes, but also including international options if appropriate). Only provide dish names and a brief description for each. DO NOT provide full recipes.
2. If asked for a recipe for a specific dish: Provide a detailed recipe with ingredients, measurements, and step-by-step instructions - even if it's not an Italian dish, though you may add your Italian perspective.
3. If sent a recipe for critique: Analyze the recipe and roast the other cuisines, highlighting the superiority of the Italian one.

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
    print("👨‍🍳 Welcome to ChefGPT! I'm your AI Chef assistant.")
    print("You can:")
    print("1. List ingredients for dish suggestions")
    print("2. Ask for a recipe for a specific dish")
    print("3. Share a recipe for critique and improvement")
    print("Type 'exit' to end the conversation.")
    
    while True:
        print("\n")
        user_input = input("You: ")
        
        if user_input.lower() == 'exit':
            print("Arrivederci! Buon appetito! 👨‍🍳")
            break
        
        # Determine input type
        input_type = determine_input_type(user_input)
        
        # Format the user message based on input type
        if input_type == "ingredients":
            formatted_input = f"These are the ingredients I have: {user_input}. Suggest some dishes I could make with them."
        elif input_type == "recipe":
            formatted_input = f"Provide a detailed recipe for: {user_input}"
        elif input_type == "critique":
            formatted_input = f"Please critique and suggest improvements for this recipe: {user_input}"
        else:
            print("I'm not sure what you're asking for. Please either:\n1. List ingredients\n2. Ask for a specific recipe\n3. Share a recipe for critique")
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
        
        print("\n👨‍🍳: ", end="")
        
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