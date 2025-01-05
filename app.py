from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

app = Flask(__name__)
CORS(app)

model = OllamaLLM(model="llama3.2:latest")  
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400
        # Simple prompt template
        prompt = ChatPromptTemplate.from_template("{text}")
        # Create reusable components
        chain = prompt | model
        # Process the text
        response = chain.invoke({"text": data['text']})
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
if __name__ == '__main__':
    app.run(debug=True, port=4999, host='0.0.0.0')