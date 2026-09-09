### 1. Which AI assistants you used and what for. Copilot, ChatGPT, Claude, Cursor, whatever you use.
- <b><i>Claude</b></i>: for project planning and coding assistant
- <b><i>Gemini</b></i>: main AI model for backend response. I selected Gemini because it has generous free tier, easy SDK set up and I'm used to it, I have used it in the last project.

### 2. Two or three prompts that actually unlocked something — and what you tried first that did not work.
- <b><i>"I dont want you to start your zip file and i just download it, i want to know the steps so i can do it by myself"</b></i> - This prompt helped Claude demonstrate the specific steps and commands to start the project. Previously, it created a zip folder with all files so I could only download and unzip with its build-in architecture. However, I wanted to have more control over the project and understand all commands running step by step, so I could review its work and regconize if something was not created in the right way. 
- <b><i>"Also, the console says we need to specify `type: module`, so i updated the `package.json` and changed it from `require` to `import`"</b></i> - Firstly, Claude used `type: commonJS` but the console returned error and suggested that we needed to update to `type: module`. After I modified this, it spotted error in `required` and I needed to change to `import/export`.

### 3. A time the AI got it wrong, and how you spotted it.
- At the beginning, Claude imported the wrong package of Google Gen AI (`@google/generative-ai` instead of the right one which is `@google/genai`), it used the outdated version of `Gemini-2.5-flash` that Google now doesn't support, and wrote the wrong code/commands to send a request to Gemini. 
- I spotted it when I tried to test the result and Gemini couldn't connect and the console returned the message clarifying that the model chosen was outdated. To fix this, I went through the documentation from Google (https://ai.google.dev/gemini-api/docs/get-started) and I changed to the right SDK with the latest stable model of `Gemini-3.8-flash` and `ai.interactions.create()`. Claude still insisted to use `Gemini-2.5-flash` and `ai.models.generateContent()` but it was not right (maybe it hasn't updated the its knowledge about the latest Google's documentation). I followed the documentation and Gemini successfully connected and returned the response correctly in Frontend.

### 4. Anything in your codebase you do not fully understand.
- To be honest, I don't fully understand why the `type: commonJS` and `require` worked in mock mode but failed when mock mode was off and needed to change to `module` and `import/export`. I debugged based on what the backend console returned and it worked. But I'm still confused about this. 
- Also, I'm still a little confused about Oxlint and Eslint. I selected Eslint as I read that it would be better for smaller scoped project. But to understand more about this, I need to research more. 

### 5. What you would fix with another four hours.
- Limitation of text field (with word counts)
- Validation of text field (for example: must include valid character strings, avoid bad injections,...)
- Advanced CSS, with logos, colors, loading badge, etc
- Save, edit, delete descriptions
- Save input text fields to localStorage so users dont have to enter repeatedly
- Write more tests
- Time out limitation for AI responses 