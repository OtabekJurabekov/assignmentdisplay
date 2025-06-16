class AIAssignmentEditor {
    constructor() {
        this.currentHeaderIndex = null;
        this.headers = [];
        this.apiUrl = '/api';
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadContent();
        this.renderHeaders();
    }

    bindEvents() {
        // Sidebar events
        document.getElementById('addHeaderBtn').addEventListener('click', () => this.openHeaderModal());
        document.getElementById('collapseBtn').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchHeaders(e.target.value));

        // Modal events
        document.getElementById('closeHeaderModal').addEventListener('click', () => this.closeHeaderModal());
        document.getElementById('cancelHeaderBtn').addEventListener('click', () => this.closeHeaderModal());
        document.getElementById('saveHeaderBtn').addEventListener('click', () => this.saveNewHeader());

        // Image modal events
        document.getElementById('addImageBtn').addEventListener('click', () => this.openImageModal());
        document.getElementById('closeImageModal').addEventListener('click', () => this.closeImageModal());
        document.getElementById('cancelImageBtn').addEventListener('click', () => this.closeImageModal());
        document.getElementById('insertImageBtn').addEventListener('click', () => this.insertImage());
        document.getElementById('uploadArea').addEventListener('click', () => document.getElementById('imageInput').click());
        document.getElementById('imageInput').addEventListener('change', (e) => this.handleImageSelect(e));

        // Drag and drop for images
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Editor events
        document.getElementById('saveBtn').addEventListener('click', () => this.saveContent());
        document.getElementById('contentEditor').addEventListener('input', () => this.markContentChanged());
        document.getElementById('contentEditor').addEventListener('paste', (e) => this.handlePaste(e));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Modal backdrop clicks
        document.getElementById('headerModal').addEventListener('click', (e) => {
            if (e.target.id === 'headerModal') this.closeHeaderModal();
        });
        document.getElementById('imageModal').addEventListener('click', (e) => {
            if (e.target.id === 'imageModal') this.closeImageModal();
        });
    }

    async loadContent() {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiUrl}/content`);
            const data = await response.json();
            this.headers = data.headers || [];
        } catch (error) {
            console.error('Failed to load content:', error);
            this.showError('Failed to load content');
        } finally {
            this.showLoading(false);
        }
    }

    renderHeaders() {
        const headersList = document.getElementById('headersList');
        headersList.innerHTML = '';

        this.headers.forEach((header, index) => {
            const headerItem = document.createElement('div');
            headerItem.className = 'header-item';
            headerItem.innerHTML = `
                <div class="header-title">${this.escapeHtml(header.title)}</div>
                <div class="header-page">Page ${header.page}</div>
            `;
            
            headerItem.addEventListener('click', () => this.selectHeader(index));
            headersList.appendChild(headerItem);
        });
    }

    selectHeader(index) {
        // Save current content before switching
        if (this.currentHeaderIndex !== null && this.hasUnsavedChanges()) {
            this.saveContent();
        }

        this.currentHeaderIndex = index;
        const header = this.headers[index];
        
        // Update UI
        document.querySelectorAll('.header-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.header-item')[index].classList.add('active');
        
        document.getElementById('currentHeaderTitle').textContent = header.title;
        document.getElementById('contentEditor').innerHTML = header.content || '';
        
        // Enable editor tools
        document.getElementById('addImageBtn').disabled = false;
        document.getElementById('saveBtn').disabled = false;
    }

    openHeaderModal() {
        document.getElementById('headerModal').classList.add('active');
        document.getElementById('headerTitle').focus();
        
        // Set default page number
        document.getElementById('headerPage').value = this.headers.length + 1;
    }

    closeHeaderModal() {
        document.getElementById('headerModal').classList.remove('active');
        this.clearHeaderForm();
    }

    clearHeaderForm() {
        document.getElementById('headerTitle').value = '';
        document.getElementById('headerPage').value = '';
        document.getElementById('headerContent').value = '';
    }

    async saveNewHeader() {
        const title = document.getElementById('headerTitle').value.trim();
        const page = parseInt(document.getElementById('headerPage').value) || this.headers.length + 1;
        const content = document.getElementById('headerContent').value.trim();

        if (!title) {
            this.showError('Please enter a header title');
            return;
        }

        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiUrl}/content/header`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, page, content }),
            });

            if (response.ok) {
                const data = await response.json();
                this.headers = data.headers;
                this.renderHeaders();
                this.closeHeaderModal();
                this.showSuccess('Header added successfully');
            } else {
                throw new Error('Failed to add header');
            }
        } catch (error) {
            console.error('Failed to add header:', error);
            this.showError('Failed to add header');
        } finally {
            this.showLoading(false);
        }
    }

    openImageModal() {
        if (this.currentHeaderIndex === null) {
            this.showError('Please select a header first');
            return;
        }
        document.getElementById('imageModal').classList.add('active');
    }

    closeImageModal() {
        document.getElementById('imageModal').classList.remove('active');
        this.resetImageModal();
    }

    resetImageModal() {
        document.getElementById('imageInput').value = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('insertImageBtn').disabled = true;
        document.getElementById('uploadArea').classList.remove('dragover');
    }

    handleImageSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.previewImage(file);
        }
    }

    previewImage(file) {
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showError('Image size must be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
            document.getElementById('insertImageBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                document.getElementById('imageInput').files = files;
                this.previewImage(file);
            } else {
                this.showError('Please drop a valid image file');
            }
        }
    }

    async insertImage() {
        const fileInput = document.getElementById('imageInput');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showError('Please select an image first');
            return;
        }

        try {
            this.showLoading(true);
            
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${this.apiUrl}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                this.insertImageIntoEditor(data.imageUrl);
                this.closeImageModal();
                this.showSuccess('Image inserted successfully');
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            this.showError('Failed to upload image');
        } finally {
            this.showLoading(false);
        }
    }

    insertImageIntoEditor(imageUrl) {
        const editor = document.getElementById('contentEditor');
        const selection = window.getSelection();
        
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '12px';
            img.style.margin = '16px 0';
            
            range.deleteContents();
            range.insertNode(img);
            
            // Move cursor after image
            range.setStartAfter(img);
            range.setEndAfter(img);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            // If no selection, append to end
            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '12px';
            img.style.margin = '16px 0';
            
            editor.appendChild(img);
        }
        
        this.markContentChanged();
    }

    async saveContent() {
        if (this.currentHeaderIndex === null) {
            this.showError('No header selected');
            return;
        }

        const content = document.getElementById('contentEditor').innerHTML;
        const updatedHeader = {
            ...this.headers[this.currentHeaderIndex],
            content: content
        };

        try {
            this.showLoading(true);
            
            const response = await fetch(`${this.apiUrl}/content/header/${this.currentHeaderIndex}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedHeader),
            });

            if (response.ok) {
                const data = await response.json();
                this.headers = data.headers;
                this.showSuccess('Content saved successfully');
                this.markContentSaved();
            } else {
                throw new Error('Failed to save content');
            }
        } catch (error) {
            console.error('Failed to save content:', error);
            this.showError('Failed to save content');
        } finally {
            this.showLoading(false);
        }
    }

    handlePaste(e) {
        // Allow pasting rich content from Word documents
        // The browser will handle most of the formatting preservation
        setTimeout(() => {
            this.markContentChanged();
        }, 10);
    }

    markContentChanged() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.textContent = '💾 Save*';
        saveBtn.style.background = 'linear-gradient(45deg, #f59e0b, #f97316)';
    }

    markContentSaved() {
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.textContent = '💾 Save';
        saveBtn.style.background = '';
    }

    hasUnsavedChanges() {
        const saveBtn = document.getElementById('saveBtn');
        return saveBtn.textContent.includes('*');
    }

    searchHeaders(query) {
        const headerItems = document.querySelectorAll('.header-item');
        const lowerQuery = query.toLowerCase();
        
        headerItems.forEach((item, index) => {
            const title = this.headers[index].title.toLowerCase();
            const shouldShow = title.includes(lowerQuery);
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const collapseBtn = document.getElementById('collapseBtn');
        const collapseIcon = collapseBtn.querySelector('.collapse-icon');
        
        sidebar.classList.toggle('collapsed');
        collapseIcon.textContent = sidebar.classList.contains('collapsed') ? '→' : '←';
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            this.saveContent();
        }
        
        // Ctrl/Cmd + N to add new header
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.openHeaderModal();
        }
        
        // Ctrl/Cmd + I to add image
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            this.openImageModal();
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 
                       type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(20px)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIAssignmentEditor();
});

// Add some helpful utility functions for the editor
window.formatText = function(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('contentEditor').focus();
};

window.insertLink = function() {
    const url = prompt('Enter URL:');
    if (url) {
        document.execCommand('createLink', false, url);
    }
};

window.insertList = function(ordered = false) {
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList', false, null);
};