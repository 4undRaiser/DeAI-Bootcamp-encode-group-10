# Submission for week1 in deAi bootcamp
# By: github.com/Justxd22
# 2025/3/9

import gi
gi.require_version('Gtk', '4.0')
from gi.repository import Gtk, GLib

import os
from dotenv import load_dotenv
from openai import OpenAI
import threading

# Load API key
load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')

# Initialize messages for the AI
messages = [
    {
        "role": "system",
        "content": "You are Remy the profeshnal chef, your client will ask you for a dish using 3 simple categories A.[Sweet|Savory|Any] B.[Italian|Indian|Thai|Korean|Egyptian|Other] C.[Easy|Hard|Meduim] based on the Client answer on these questons you will suggest 1 dish that meets the 3 options you will provide detailed recipes for dish, You always try to be as clear as possible and provide the best possible recipes meeting the 3 options.",
    },
    {
        "role": "system",
        "content": "Your client is going to ask for a recipe using the three options eg. in the following format 'A.Sweet B.Thai C.Easy'. If you can't find the dish, you should not try to generate a recipe for it, you must answer directly with a detailed recipe for it if you find a compatible dish. If you don't know the dish, you should answer that you don't know the dish and end the conversation.",
    }
]
# Main window class
class RecipeApp(Gtk.ApplicationWindow):
    def __init__(self, app):
        super().__init__(application=app, title="Remy's Recipe App")
        self.set_default_size(700, 500)
        
        # OpenAI client setup
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://generativelanguage.googleapis.com/v1beta/"
        )
        
        # Create the UI layout
        main_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=10)
        self.set_child(main_box)
        
        # Add header
        header_label = Gtk.Label()
        header_label.set_markup("<span size='x-large'>Remy's Recipe Finder</span>")
        header_label.set_margin_top(20)
        header_label.set_margin_bottom(10)
        main_box.append(header_label)
        
        # Create dropdown options
        options_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=10)
        options_box.set_margin_start(20)
        options_box.set_margin_end(20)
        options_box.set_margin_bottom(10)
        options_box.set_halign(Gtk.Align.CENTER)
        
        # Option A: Type
        type_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=5)
        type_label = Gtk.Label(label="A. Type")
        self.type_combo = Gtk.ComboBoxText()
        for option in ["Sweet", "Savory", "Any"]:
            self.type_combo.append_text(option)
        self.type_combo.set_active(0)
        type_box.append(type_label)
        type_box.append(self.type_combo)
        
        # Option B: Cuisine
        cuisine_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=5)
        cuisine_label = Gtk.Label(label="B. Cuisine")
        self.cuisine_combo = Gtk.ComboBoxText()
        for option in ["Italian", "Indian", "Thai", "Korean", "Egyptian", "Other"]:
            self.cuisine_combo.append_text(option)
        self.cuisine_combo.set_active(0)
        cuisine_box.append(cuisine_label)
        cuisine_box.append(self.cuisine_combo)
        
        # Option C: Difficulty
        difficulty_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=5)
        difficulty_label = Gtk.Label(label="C. Difficulty")
        self.difficulty_combo = Gtk.ComboBoxText()
        for option in ["Easy", "Medium", "Hard"]:
            self.difficulty_combo.append_text(option)
        self.difficulty_combo.set_active(0)
        difficulty_box.append(difficulty_label)
        difficulty_box.append(self.difficulty_combo)
        
        options_box.append(type_box)
        options_box.append(cuisine_box)
        options_box.append(difficulty_box)
        main_box.append(options_box)
        
        button_box = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL)
        button_box.set_halign(Gtk.Align.CENTER)
        button_box.set_margin_bottom(20)
        get_button = Gtk.Button(label="Get Recipe")
        get_button.connect("clicked", self.get_recipe)
        button_box.append(get_button)
        main_box.append(button_box)
        
        # Text area for displaying recipes
        scrolled = Gtk.ScrolledWindow()
        scrolled.set_vexpand(True)
        scrolled.set_margin_start(20)
        scrolled.set_margin_end(20)
        scrolled.set_margin_bottom(20)
        
        self.text_view = Gtk.TextView()
        self.text_view.set_editable(False)
        self.text_view.set_wrap_mode(Gtk.WrapMode.WORD)
        self.text_buffer = self.text_view.get_buffer()
        
        # Set welcome text
        welcome_text = "Welcome to Remy Chief Restraunt! Select your preferences from the dropdowns above and click 'Get Recipe'."
        self.text_buffer.set_text(welcome_text)
        
        scrolled.set_child(self.text_view)
        main_box.append(scrolled)
    
    # Function to get recipe when button is clicked
    def get_recipe(self, button):
        # Get selected options
        type_option = self.type_combo.get_active_text()
        cuisine_option = self.cuisine_combo.get_active_text()
        difficulty_option = self.difficulty_combo.get_active_text()
        
        # Format query string
        query = f"A.{type_option} B.{cuisine_option} C.{difficulty_option}"
        
        # Update the text view to show the query
        self.text_buffer.set_text(f"You requested: {query}\n\nChef Remy is preparing your recipe...\n\n")
        
        # Add user request to messages list
        messages.append({
            "role": "user", 
            "content": query
        })
        
        # Start API call in background thread
        threading.Thread(target=self.get_ai_response, daemon=True).start()
    
    # Function to get AI response
    def get_ai_response(self):
        try:
            stream = self.client.chat.completions.create(
                model="gemini-2.0-flash",
                messages=messages,
                stream=True,
            )
            
            response_text = ""
            for chunk in stream:
                text = chunk.choices[0].delta.content or ""
                response_text += text
                # Update UI
                GLib.idle_add(self.update_text, text)
            
            # Save response in messages
            messages.append({"role": "system", "content": response_text})
            
        except Exception as e:
            GLib.idle_add(self.update_text, f"\nError: {str(e)}")
    
    # Function to update the text view with AI response
    def update_text(self, text):
        end = self.text_buffer.get_end_iter()
        self.text_buffer.insert(end, text)
        mark = self.text_buffer.create_mark(None, self.text_buffer.get_end_iter(), False)
        self.text_view.scroll_to_mark(mark, 0.0, False, 0.0, 0.0)
        return False

# Main app class
class MyApp(Gtk.Application):
    def __init__(self):
        super().__init__()
    
    def do_activate(self):
        win = RecipeApp(self)
        win.present()

app = MyApp()
app.run(None)
