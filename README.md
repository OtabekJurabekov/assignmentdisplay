# AI Assignment Website

A modern, transparent UI website for managing AI assignment content with rich text editing capabilities.

## Features

- 🎨 **Modern Transparent UI**: Glassmorphism design with glowy borders and white-blue color palette
- 📝 **Rich Text Editor**: Full-featured content editor with formatting preservation
- 🖼️ **Image Management**: Upload and insert images anywhere in content
- 🔍 **Search & Navigation**: Easy header navigation with search functionality
- 💾 **Auto-save**: Real-time content saving with JSON database
- 📱 **Responsive Design**: Works perfectly on all devices
- ⌨️ **Keyboard Shortcuts**: Efficient workflow with hotkeys

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000`

## Usage

### Adding Headers
- Click the "Add Header" button in the sidebar
- Fill in the title, page number, and optional content
- Press Ctrl/Cmd + N for quick access

### Editing Content
- Select any header from the sidebar
- Start typing in the editor
- Paste rich content directly from Word documents
- Formatting will be preserved automatically

### Adding Images
- Click the image tool in the editor toolbar
- Upload images via drag & drop or file selection
- Images are automatically resized and optimized
- Press Ctrl/Cmd + I for quick access

### Keyboard Shortcuts
- `Ctrl/Cmd + S`: Save current content
- `Ctrl/Cmd + N`: Add new header
- `Ctrl/Cmd + I`: Insert image

## Project Structure

```
ai-assignment-site/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   └── data/           # JSON database
├── public/
│   ├── css/            # Stylesheets
│   ├── js/             # Frontend JavaScript
│   └── assets/         # Static assets
└── README.md
```

## API Endpoints

- `GET /api/content` - Retrieve all content
- `POST /api/content` - Update content
- `POST /api/content/header` - Add new header
- `PUT /api/content/header/:index` - Update header
- `DELETE /api/content/header/:index` - Delete header
- `POST /api/upload` - Upload image

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Database**: JSON files
- **UI**: Glassmorphism design with CSS3

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use this project for your assignments!