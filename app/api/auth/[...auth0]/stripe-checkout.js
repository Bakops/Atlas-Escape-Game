export default async function handler(req, res) {
  const { amount } = JSON.parse(req.body);
  const backendUrl =
    "https://api-spring-l3i0.onrender.com/stripe/checkout?amount=" + amount;
  const response = await fetch(backendUrl, { method: "POST" });
  const url = await response.text();
  res.status(200).send(url);
}
