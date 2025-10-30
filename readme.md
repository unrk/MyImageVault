# MyImageVault

Static image hosting using GitHub Pages and GitHub API. No backend required.

## Features

- Drag-and-drop interface
- Token-based authentication
- Direct image URLs
- Responsive design
- No server costs

## Quick Start

### 1. Fork Repository

Fork this repository to `https://github.com/[username]/MyImageVault`

### 2. Enable GitHub Pages

- Navigate to: Settings → Pages
- Source: GitHub Actions
- Deployment URL: `https://[username].github.io/MyImageVault/`

### 3. Generate Token

[Create token](https://github.com/settings/tokens) with `repo` scope. Save immediately.

### 4. Access Vault

Visit deployment URL, enter:
- GitHub username
- Repository name
- Personal access token

---

## Manual Setup

### 1. Initialize Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/[username]/MyImageVault.git
git push -u origin main
```

### 2. Configure Pages

Settings → Pages → Source: GitHub Actions

### 3. Generate Token

[Token settings](https://github.com/settings/tokens) → Generate token (classic) → Select `repo` scope

### 4. Login

Access `https://[username].github.io/MyImageVault/` with credentials

---

## Usage

**Upload**: Drag images or click to browse. Supports JPG, PNG, GIF, WebP.

**Manage**: Click images to view full size. Copy URLs for sharing. Delete as needed.

**Image URLs**: `https://raw.githubusercontent.com/[username]/MyImageVault/main/images/[timestamp]_[filename]`

## Security

- Token stored in browser localStorage
- Token required for upload/delete operations
- Images viewable by anyone with direct URL
- Revoke compromised tokens immediately

## Technical Stack

- Frontend: HTML, CSS, JavaScript
- API: GitHub REST API v3
- Storage: Git repository
- Hosting: GitHub Pages
- Auth: Personal Access Token

## Structure

```
MyImageVault/
├── index.html
├── images/
│   └── .gitkeep
├── .github/workflows/
│   └── pages.yml
└── README.md
```

## Troubleshooting

**Authentication fails**: Verify username, repository name, and token. Check `repo` scope enabled.

**Images don't load**: Confirm token validity. Ensure `images/` folder exists in repository.

**Upload fails**: Verify token write permissions. Check file format. Review browser console.

**Pages not updating**: Wait 1-2 minutes. Check Actions tab for deployment status.

## License

Open source. Personal use.

