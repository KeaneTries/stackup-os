import React, { useState } from "react";

export default function ChatGptWidget() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    // Do not make an API call if input is empty
    if (inputText.trim() === "") return;

    try {
      setLoading(true)
      setResponseText('')
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              process.env.REACT_APP_API_KEY ?? "YOUR_API_KEY"
            }`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            max_tokens: 100,
            messages: [
              {role: "system", content: "You are a helpful assistant. Keep your replies within 80 words."},
              { role: "user", content: `${inputText}. Keep your reply within 80 words.`  },
            ],
          }),
        }
      );

      const data = await response.json();

      // Extract the generated response from the API
      const { choices } = data;
      const generatedText = choices
        .map((choice) => choice.message.content)
        .join("");

      setResponseText(generatedText);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setInputText("")
      setLoading(false)
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    
    <div style={{ minWidth: 300 }}>
      {responseText ?? <div>{responseText}</div>}
      <br/><br/>
      {loading ? <center>Loading...</center> : 
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "row",}}>
        <input
          className="text-input"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter a short ChatGPT query"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        ></input>
        <button
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "15px",
            cursor: "pointer",
          }} 
          onClick={handleSubmit}
        >{"Send  >"}</button>
      </div>}
    </div>
    
  );
}
