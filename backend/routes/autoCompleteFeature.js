import axios from 'axios'

const KEY = process.env.RAPID_API_KEY
const HOST = process.env.RAPID_API_HOST

export const autoCompleteFeature = async (req, res) => {
  const { input } = req.query;
  if (!input || input.length < 3) {
    return 
  }
  try {
    const response = await axios.get("https://place-autocomplete1.p.rapidapi.com/autocomplete/json", {
      params: {
        input,
        radius: "500"
      },
      headers: {
        "x-rapidapi-key": `${KEY}`,
        "x-rapidapi-host": `${HOST}`
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
};

