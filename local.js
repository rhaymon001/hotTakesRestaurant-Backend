import app from "./server.js";

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Local dev server running on http://localhost:${PORT}`);
});
