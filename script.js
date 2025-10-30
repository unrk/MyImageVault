let config = {
  owner: "",
  repo: "",
  token: "",
  branch: "main",
};

const IMAGES_FOLDER = "images";
const STORAGE_KEY = "imageVaultConfig";

// Load saved config
function loadSavedConfig() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      config = { ...config, ...parsed };
      document.getElementById("repoOwner").value = config.owner || "";
      document.getElementById("repoName").value = config.repo || "";
      if (config.token) {
        autoLogin();
      }
    } catch (e) {
      console.error("Error loading saved config:", e);
    }
  }
}

// Save config to localStorage
function saveConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

// Login
async function login() {
  const owner = document.getElementById("repoOwner").value.trim();
  const repo = document.getElementById("repoName").value.trim();
  const token = document.getElementById("token").value.trim();

  if (!owner || !repo || !token) {
    showStatus("authStatus", "Please fill in all fields", "error");
    return;
  }

  config.owner = owner;
  config.repo = repo;
  config.token = token;

  showStatus("authStatus", "Verifying credentials...", "info");

  try {
    // Test the token by making a simple API call
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Invalid credentials or repository not found");
    }

    saveConfig();
    showStatus("authStatus", "Login successful!", "success");

    setTimeout(() => {
      document.getElementById("authSection").classList.add("hidden");
      document.getElementById("userInfo").classList.remove("hidden");
      document.getElementById(
        "currentUser"
      ).textContent = `${owner}/${repo}`;
      document.getElementById("uploadSection").classList.remove("hidden");
      document
        .getElementById("gallerySection")
        .classList.remove("hidden");
      loadGallery();
    }, 1000);
  } catch (error) {
    showStatus("authStatus", `Error: ${error.message}`, "error");
  }
}

// Auto login with saved credentials
async function autoLogin() {
  if (config.token && config.owner && config.repo) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${config.owner}/${config.repo}`,
        {
          headers: {
            Authorization: `token ${config.token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.ok) {
        document.getElementById("authSection").classList.add("hidden");
        document.getElementById("userInfo").classList.remove("hidden");
        document.getElementById(
          "currentUser"
        ).textContent = `${config.owner}/${config.repo}`;
        document
          .getElementById("uploadSection")
          .classList.remove("hidden");
        document
          .getElementById("gallerySection")
          .classList.remove("hidden");
        loadGallery();
      }
    } catch (e) {
      console.error("Auto login failed:", e);
    }
  }
}

// Logout
function logout() {
  config = { owner: "", repo: "", token: "", branch: "main" };
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById("authSection").classList.remove("hidden");
  document.getElementById("userInfo").classList.add("hidden");
  document.getElementById("uploadSection").classList.add("hidden");
  document.getElementById("gallerySection").classList.add("hidden");
  document.getElementById("repoOwner").value = "";
  document.getElementById("repoName").value = "";
  document.getElementById("token").value = "";
  document.getElementById("gallery").innerHTML = "";
}

// Show status message
function showStatus(elementId, message, type = "info") {
  const statusEl = document.getElementById(elementId);
  statusEl.className = `status-message ${type}`;
  statusEl.textContent = message;
  statusEl.style.display = "block";
}

// Drop zone handling
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

// Handle file uploads
async function handleFiles(files) {
  const imageFiles = Array.from(files).filter((file) =>
    file.type.startsWith("image/")
  );

  if (imageFiles.length === 0) {
    showStatus(
      "uploadStatus",
      "Please select valid image files",
      "error"
    );
    return;
  }

  showStatus(
    "uploadStatus",
    `Uploading ${imageFiles.length} image(s)...`,
    "info"
  );

  let successCount = 0;
  let errorCount = 0;

  for (const file of imageFiles) {
    try {
      await uploadImage(file);
      successCount++;
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      errorCount++;
    }
  }

  if (errorCount === 0) {
    showStatus(
      "uploadStatus",
      `Successfully uploaded ${successCount} image(s)!`,
      "success"
    );
  } else {
    showStatus(
      "uploadStatus",
      `Uploaded ${successCount}, failed ${errorCount}`,
      "error"
    );
  }

  fileInput.value = "";
  setTimeout(() => loadGallery(), 1000);
}

// Upload single image to GitHub
async function uploadImage(file) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async (e) => {
      try {
        const content = e.target.result.split(",")[1]; // Get base64 content
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(
          /[^a-zA-Z0-9.-]/g,
          "_"
        )}`;
        const path = `${IMAGES_FOLDER}/${fileName}`;

        const response = await fetch(
          `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${config.token}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Add image: ${fileName}`,
              content: content,
              branch: config.branch,
            }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Upload failed");
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// Load gallery from GitHub
async function loadGallery() {
  const gallery = document.getElementById("gallery");
  const loading = document.getElementById("loadingGallery");

  loading.style.display = "block";
  gallery.innerHTML = "";

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${IMAGES_FOLDER}`,
      {
        headers: {
          Authorization: `token ${config.token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Images folder doesn't exist yet
        loading.textContent = "No images yet. Upload your first image!";
        return;
      }
      throw new Error("Failed to load images");
    }

    const files = await response.json();
    const imageFiles = files.filter(
      (file) =>
        file.type === "file" &&
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)
    );

    loading.style.display = "none";

    if (imageFiles.length === 0) {
      loading.style.display = "block";
      loading.textContent = "No images yet. Upload your first image!";
      return;
    }

    // Sort by name (which includes timestamp) descending
    imageFiles.sort((a, b) => b.name.localeCompare(a.name));

    imageFiles.forEach((file) => {
      const item = createGalleryItem(file);
      gallery.appendChild(item);
    });
  } catch (error) {
    loading.textContent = `Error loading gallery: ${error.message}`;
    console.error("Error loading gallery:", error);
  }
}

// Create gallery item element
function createGalleryItem(file) {
  const item = document.createElement("div");
  item.className = "gallery-item";

  const img = document.createElement("img");
  img.src = file.download_url;
  img.alt = file.name;
  img.onclick = () => openModal(file.download_url);

  const info = document.createElement("div");
  info.className = "gallery-item-info";

  const name = document.createElement("div");
  name.className = "gallery-item-name";
  name.textContent = file.name;
  name.title = file.name;

  const actions = document.createElement("div");
  actions.className = "gallery-item-actions";

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Copy URL";
  copyBtn.onclick = (e) => {
    e.stopPropagation();
    copyImageUrl(file.download_url);
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    deleteImage(file);
  };

  actions.appendChild(copyBtn);
  actions.appendChild(deleteBtn);
  info.appendChild(name);
  info.appendChild(actions);
  item.appendChild(img);
  item.appendChild(info);

  return item;
}

// Copy image URL to clipboard
function copyImageUrl(url) {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      alert("Image URL copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
}

// Delete image from GitHub
async function deleteImage(file) {
  console.log("deleteImage called with file:", file);
  
  if (!confirm(`Are you sure you want to delete ${file.name}?`)) {
    console.log("User cancelled deletion");
    return;
  }

  console.log("Attempting to delete:", file.path, "with sha:", file.sha);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${file.path}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `token ${config.token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Delete image: ${file.name}`,
          sha: file.sha,
          branch: config.branch,
        }),
      }
    );

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Delete failed with error:", errorData);
      throw new Error(errorData.message || "Failed to delete image");
    }

    alert("Image deleted successfully!");
    loadGallery();
  } catch (error) {
    alert(`Error deleting image: ${error.message}`);
    console.error("Error deleting image:", error);
  }
}

// Modal functions
function openModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modal.classList.add("show");
  modalImg.src = imageSrc;
}

function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.classList.remove("show");
}

// Close modal on click outside
document.getElementById("imageModal").addEventListener("click", (e) => {
  if (e.target.id === "imageModal") {
    closeModal();
  }
});

// Initialize
loadSavedConfig();
