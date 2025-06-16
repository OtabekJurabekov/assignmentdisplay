import * as contentService from '../services/contentService.js';

export const getContent = async (req, res) => {
  try {
    const content = await contentService.getContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve content' });
  }
};

export const updateContent = async (req, res) => {
  try {
    const updatedContent = await contentService.updateContent(req.body);
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
};

export const addHeader = async (req, res) => {
  try {
    const { title, page } = req.body;
    const updatedContent = await contentService.addHeader(title, page);
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add header' });
  }
};

export const updateHeader = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const headerData = req.body;
    const updatedContent = await contentService.updateHeader(index, headerData);
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update header' });
  }
};

export const deleteHeader = async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const updatedContent = await contentService.deleteHeader(index);
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete header' });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
};