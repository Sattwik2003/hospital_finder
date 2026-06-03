export const checkBackend = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/");
    return res.ok;
  } catch (err) {
    return false;
  }
};

export const predictSpecialty = async (symptoms) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "Prediction failed");
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
};