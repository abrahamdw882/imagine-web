const proxyUrl = "https://broken-star-6439.abrahamdw882.workers.dev/?u="; 
let currentImageBlob = null;

async function generateImage() {
  const prompt = document.getElementById("promptInput").value;
  const generateButton = document.getElementById("generateButton");
  const loader = document.getElementById("loader");
  const generatedImage = document.getElementById("generatedImage");
  const downloadButton = document.getElementById("downloadButton");
  const error = document.getElementById("error");

  generatedImage.style.display = "none";
  downloadButton.style.display = "none";
  error.style.display = "none";
  error.innerText = "";
  currentImageBlob = null;

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  generateButton.disabled = true;
  loader.style.display = "block";

  const apiUrl = `https://bk9.fun/ai/magicstudio?prompt=${encodeURIComponent(prompt)}`;
  const proxiedUrl = `${proxyUrl}${encodeURIComponent(apiUrl)}`;

  try {
    const response = await fetch(proxiedUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    currentImageBlob = await response.blob();

    const imageUrl = URL.createObjectURL(currentImageBlob);
    generatedImage.src = imageUrl;
    generatedImage.style.display = "block";
    downloadButton.style.display = "block";
  } catch (error) {
    error.style.display = "block";
    error.innerText = "An error occurred. Please try again.";
  } finally {
    generateButton.disabled = false;
    loader.style.display = "none";
  }
}

function openModal() {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const generatedImage = document.getElementById("generatedImage");

  modalImage.src = generatedImage.src;
  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none";
}

function downloadImage() {
  if (!currentImageBlob) {
    alert("No image to download.");
    return;
  }

  const downloadLink = document.createElement("a");
  const url = URL.createObjectURL(currentImageBlob);
  downloadLink.href = url;
  downloadLink.download = "generated-image.png";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
