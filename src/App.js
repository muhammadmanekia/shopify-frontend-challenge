import React, { useEffect, useState } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

const { Configuration, OpenAIApi } = require("openai");

const App = () => {
  const [input, setInput] = useState("");
  const [dropdown, setDropdown] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [responses, setResponses] = useState([]);
  const [preset] = useState([
    {
      name: "Grammatical Standard English",
      sampText: "Correct this to standard English:\n\n",
    },
    {
      name: "Summarize for a 2nd grader",
      sampText: "Summarize this for a second-grade student:\n\n",
    },
    {
      name: "Text to command",
      sampText: "Convert this text to a programmatic command:\n\n",
    },
    {
      name: "English to other languages",
      sampText:
        "Translate this into 1. French, 2. Spanish and 3. Japanese:\n\n",
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted!");
    console.log(input);

    setPrompts([input, ...prompts]);
    setInput("");
    setDropdown("");

    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);

    openai
      .createCompletion("text-curie-001", {
        prompt: `${input}`,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      .then((response) => {
        console.log(response);
        setResponses([response.data.choices[0].text, ...responses]);
      });
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleReset = () => {
    setInput("");
    setDropdown("");
  };

  const handleDropdown = (e) => {
    setDropdown(e.target.value);
  };

  useEffect(() => {
    preset.map((p) => {
      if (p.name === dropdown) {
        var sampleText = p.sampText;
        setInput(sampleText);
      }
      return null;
    });
  }, [dropdown, preset]);

  return (
    <div className="App">
      <h2>Front End Developer Intern Challenge</h2>
      <h4 style={{ color: "gray" }}>Muhammad Manekia</h4>
      <div style={{ float: "right", paddingBottom: "10px" }}>
        <InputLabel id="preset-label">Load a preset</InputLabel>
        <Select
          labelId="preset-label"
          id="preset-label-id"
          value={dropdown}
          onChange={handleDropdown}
          style={{ width: "250px" }}
        >
          {preset.map((p) => (
            <MenuItem key={p.name} value={p.name}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <form onSubmit={handleSubmit}>
        <TextField
          id="outlined-multiline-flexible"
          label="Enter Prompt"
          multiline
          fullWidth
          maxRows={8}
          value={input}
          onChange={handleChange}
        />
        <div className="buttonDiv">
          <Button style={{ color: "gray" }} onClick={handleReset}>
            <ClearIcon />
            Clear
          </Button>
          <Button
            type="submit"
            variant="contained"
            style={{ backgroundColor: "#009688" }}
          >
            Submit
          </Button>
        </div>
      </form>
      <br />
      <h3>Previous Conversations:</h3>
      {prompts.map((prompt, i) => {
        return (
          <Paper elevation={3} style={{ margin: "10px", padding: "10px" }}>
            <div style={{ padding: "10px" }}>
              <h4 style={{ display: "inline" }}>Prompt:&nbsp;</h4>
              <span>{prompt}</span>
            </div>
            <div style={{ padding: "10px" }}>
              <h4 style={{ display: "inline" }}>Response:&nbsp;</h4>
              <span>{responses[i]}</span>
            </div>
          </Paper>
        );
      })}
    </div>
  );
};

export default App;
