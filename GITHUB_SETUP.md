# GitHub Repository Setup

Your project is now initialized with Git! Follow these steps to create and connect your GitHub repository.

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: **`come-stay-at-my-place`**
4. Description (optional): "Bigg Slim Events & Entertainment - Professional DJ & Entertainment Services"
5. Choose **Public** or **Private** (your choice)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 2: Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/dominiquesealy/Desktop/Come-Stay-With-Me
git remote add origin https://github.com/YOUR-USERNAME/come-stay-at-my-place.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

## Step 3: Verify

Visit: `https://github.com/YOUR-USERNAME/come-stay-at-my-place` to see your code!

---

## Quick Commands Reference

**Add and commit changes:**
```bash
git add .
git commit -m "Your commit message"
git push
```

**Check status:**
```bash
git status
```

**View commits:**
```bash
git log
```

