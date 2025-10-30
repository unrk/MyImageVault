# 🔒 My Image Vault

A secure, personal image hosting solution powered by GitHub Pages and GitHub API. Upload images through a beautiful web interface and store them directly in your GitHub repository - accessible anywhere, anytime.

## ✨ Features

- 🎨 **Beautiful drag-and-drop interface** - Upload images with ease
- 🔐 **Secure authentication** - Only you can upload images using your GitHub token
- 🌍 **Public access** - All uploaded images are accessible via direct URLs
- 📱 **Responsive design** - Works perfectly on desktop and mobile
- 🖼️ **Image gallery** - View, copy URLs, and delete images
- 💾 **No backend needed** - Fully static, powered by GitHub API
- ⚡ **Fast and reliable** - Hosted on GitHub Pages infrastructure

## 🚀 Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. The site will be available at: `https://[your-username].github.io/MyImageVault/`

### 2. Create a Personal Access Token

You need a GitHub Personal Access Token to upload images:

1. Go to [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Give it a name (e.g., "Image Vault Upload")
4. Set expiration (or choose "No expiration" for convenience)
5. Select the **`repo`** scope (this gives full control of private repositories)
6. Click **Generate token**
7. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

### 3. Use Your Image Vault

1. Visit your GitHub Pages URL: `https://[your-username].github.io/MyImageVault/`
2. Enter your credentials:
   - **GitHub Username**: Your GitHub username
   - **Repository Name**: `MyImageVault` (or whatever you named this repo)
   - **Personal Access Token**: The token you just created
3. Click **Login & Load Vault**

Your credentials will be saved in your browser's localStorage for convenience.

## 📖 How to Use

### Uploading Images

1. **Drag and drop** images onto the upload zone, or **click** to browse
2. Multiple images can be uploaded at once
3. Supported formats: JPG, PNG, GIF, WebP
4. Images are stored in the `images/` folder with timestamps

### Managing Images

- **View full size**: Click on any image thumbnail
- **Copy URL**: Click the "Copy URL" button to get the direct image link
- **Delete**: Click the "Delete" button to remove an image from the vault
- **Share**: Use the copied URLs to share images anywhere

### Image URLs

All uploaded images have URLs in this format:
```
https://raw.githubusercontent.com/[username]/MyImageVault/main/images/[timestamp]_[filename]
```

These URLs can be used anywhere: websites, forums, documentation, etc.

## 🔒 Security Notes

- **Your token is stored locally** in your browser's localStorage
- **Never share your Personal Access Token** with anyone
- **Only you** can upload or delete images (requires the token)
- **Anyone can view** images if they have the direct URL
- If you suspect your token is compromised, revoke it immediately on GitHub and generate a new one

## 🛠️ Technical Details

- **Frontend**: Pure HTML, CSS, and JavaScript (no frameworks)
- **API**: GitHub REST API v3
- **Storage**: GitHub repository
- **Hosting**: GitHub Pages (static)
- **Authentication**: Personal Access Token (stored in localStorage)

## 📝 Repository Structure

```
MyImageVault/
├── index.html              # Main web interface
├── images/                 # Uploaded images stored here
│   └── .gitkeep           # Keeps folder in git
├── .github/
│   └── workflows/
│       └── pages.yml      # GitHub Pages deployment
└── README.md              # This file
```

## 🎯 Use Cases

- Personal image hosting
- Blog image storage
- Documentation screenshots
- Portfolio images
- Quick image sharing
- Backup for important photos

## 🐛 Troubleshooting

### "Invalid credentials or repository not found"
- Double-check your username, repository name, and token
- Make sure your token has the `repo` scope enabled
- Verify the repository name matches exactly

### "Failed to load images"
- Check if you're connected to the internet
- Verify your token hasn't expired
- Make sure the `images/` folder exists in your repository

### Images not uploading
- Check file format (must be image files)
- Verify your token has write permissions
- Check browser console for detailed error messages

### GitHub Pages not updating
- Wait a few minutes - deployment can take 1-2 minutes
- Check the Actions tab in your repository for deployment status
- Verify GitHub Pages is enabled in repository settings

## 📜 License

This project is open source and available for personal use.

## 🙏 Credits

Built with ❤️ using GitHub's infrastructure

---

**Ready to start?** Just push this repository to GitHub and follow the setup instructions above!
