import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/content.json');

export const getContent = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return default structure
    const defaultData = await initializeDefaultData();
    return defaultData;
  }
};

export const saveContent = async (content) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(content, null, 2));
    return content;
  } catch (error) {
    throw new Error('Failed to save content');
  }
};

export const updateContent = async (newContent) => {
  return await saveContent(newContent);
};

export const addHeader = async (title, page) => {
  const content = await getContent();
  const newHeader = {
    title,
    page: page || content.headers.length + 1,
    content: ""
  };
  content.headers.push(newHeader);
  return await saveContent(content);
};

export const updateHeader = async (index, headerData) => {
  const content = await getContent();
  if (index >= 0 && index < content.headers.length) {
    content.headers[index] = { ...content.headers[index], ...headerData };
    return await saveContent(content);
  }
  throw new Error('Header index out of bounds');
};

export const deleteHeader = async (index) => {
  const content = await getContent();
  if (index >= 0 && index < content.headers.length) {
    content.headers.splice(index, 1);
    return await saveContent(content);
  }
  throw new Error('Header index out of bounds');
};

const initializeDefaultData = async () => {
  const defaultData = {
    headers: [
      {
        title: "Introduction",
        page: 4,
        content: ""
      },
      {
        title: "A.P1. Describe how the fundamental concepts of AI are used in industry to meet specific identified needs",
        page: 4,
        content: ""
      },
      {
        title: "A.P2. Explain the associated benefits, risks and drawbacks of AI in different industries",
        page: 6,
        content: ""
      },
      {
        title: "A.M1. Analyse the benefits, risks and drawbacks of AI and how they impact on different industries",
        page: 9,
        content: ""
      },
      {
        title: "A.D1. Evaluate the impact of AI on different industries",
        page: 11,
        content: ""
      },
      {
        title: "B.P3. Define the objectives of an AI project",
        page: 14,
        content: ""
      },
      {
        title: "B.P4. Gather and prepare appropriate data sets for an AI solution",
        page: 16,
        content: ""
      },
      {
        title: "B.M2. Review and refine data sets to optimise the quality of an AI solution",
        page: 18,
        content: ""
      },
      {
        title: "B.D2. Evaluate the effectiveness of the AI solution",
        page: 20,
        content: ""
      },
      {
        title: "C.P5. Develop an AI solution using an appropriate programming language and computing tools",
        page: 22,
        content: ""
      },
      {
        title: "C.M3. Test and refine the AI solution",
        page: 24,
        content: ""
      },
      {
        title: "C.D3. Evaluate the effectiveness of the AI solution",
        page: 26,
        content: ""
      },
      {
        title: "Final Conclusion",
        page: 28,
        content: ""
      },
      {
        title: "Reference",
        page: 30,
        content: ""
      }
    ]
  };
  
  await saveContent(defaultData);
  return defaultData;
};