// api.js
const BASE_URL = "https://xzfqv11j-8000.inc1.devtunnels.ms/api";

export async function fetchModuleById(moduleId) {
  try {
    const response = await fetch(`${BASE_URL}/module/${moduleId}`);
    if (!response.ok) throw new Error("Failed to fetch module");
    return await response.json();
  } catch (err) {
    console.error("Error fetching module:", err);
    return null;
  }
}
