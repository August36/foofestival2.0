export default async function handler(req, res) {
  const url = "http://localhost:8080/schedule";
  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json(data);
}