import sys
from ai_engine import stream_legend_chat, analyze_user_persona


print("--- 🧠 TESTING CONVERSATION MEMORY: A.P.J. Abdul Kalam ---")

# Simulating what the Frontend (Member 3) will send to Member 2's API
simulated_chat_history = [
    {"role": "user", "text": "Hello, my name is Medha and I am building an AI platform."},
    {"role": "model", "text": "Greetings, Medha! It is a profound joy to meet a young mind dedicated to innovation. Building an AI platform is a wonderful endeavor. Remember, you have to dream before your dreams can come true. How may I assist your vision today?"}
]

# A follow-up query that REQUIRES the AI to look at the history array to answer correctly
new_query = "Can you remind me what my name is, and give me one piece of advice for leading my technical team?"

# Pass the history array into your new function
for chunk in stream_legend_chat("a.p.j. abdul kalam", new_query, history=simulated_chat_history):
    sys.stdout.write(chunk)
    sys.stdout.flush()
print("\n" + "="*50 + "\n")

print("--- 🪞 TESTING PERSONAX (5-Question Model) ---")
# Passing your exact parameters plus two simulated scenario answers
analysis = analyze_user_persona(
    q1_motivation="The thought of being financially independent and my dreams motivate me.",
    q2_fear="Failure, being dependent on someone for life is my biggest fear.",
    q3_failure="I try to improve the mistakes I make, look at the long term goal and start working again.",
    q4_conflict="I try to listen to their logic first, present my own data calmly, and find a pragmatic middle ground.",
    q5_adaptability="I take a quick step back to analyze the new situation, recalibrate my timeline, and get back to execution."
)

# Printing out the exact attributes returned from the Gemini Engine
print(f"Archetype: {analysis.personality_archetype}")
print(f"Strengths: {analysis.strengths}")
print(f"Weaknesses: {analysis.weaknesses}")
print(f"Suggested Path: {analysis.suggested_career}")
print(f"\nFull JSON Validation Matrix:\n{analysis.model_dump_json(indent=2)}")