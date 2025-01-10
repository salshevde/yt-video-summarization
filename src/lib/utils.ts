import { jsPDF } from 'jspdf';

// Function to convert an image URL to base64
const loadImageAsBase64 = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const downloadPDF = async (summary: any) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(summary.video_title, 20, 20);
  
  // Add metadata
  doc.setFontSize(12);
  doc.text(`Category: ${summary.category}`, 20, 35);
  doc.text(`Language: ${summary.language}`, 20, 45);
  
  // Add the thumbnail image (if exists)
  if (summary.thumbnail_url) {
    try {
      // Convert the thumbnail image URL to base64
      const base64Image = await loadImageAsBase64(summary.thumbnail_url);
      // Add the image to the PDF
      doc.addImage(base64Image, 'JPEG', 20, 50, 50, 50);  // Adjust size and position
    } catch (error) {
      console.error("Error loading thumbnail image:", error);
    }
  }
  
  // Add summary content
  doc.setFontSize(14);
  doc.text('Summary:', 20, 110);
  
  const splitText = doc.splitTextToSize(summary.summary, 170);
  doc.text(splitText, 20, 120);
  
  // Add keywords
  doc.text('Keywords:', 20, doc.internal.pageSize.height - 40);
  doc.text(summary.keywords.map((k: string) => `#${k}`).join(', '), 20, doc.internal.pageSize.height - 30);
  
  // Save the PDF with a sanitized title
  doc.save(`${summary.video_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.pdf`);
};

export const generateSocialPost = (summary: any, platform: 'instagram' | 'linkedin') => {
  if (platform === 'instagram') {
    return `📺 Video Summary: ${summary.video_title}

🎯 Key Points:
${summary.summary.slice(0, 200)}...

🏷️ ${summary.keywords.map((k: string) => `#${k}`).join(' ')}

#VideoSummary #${summary.category} #Learning`;
  }
  
  return `🎥 Video Summary: ${summary.video_title}

📝 Summary:
${summary.summary}

🔑 Key Topics:
${summary.keywords.map((k: string) => `• ${k}`).join('\n')}

Category: ${summary.category}
Language: ${summary.language}

#VideoSummary #${summary.category} #ProfessionalDevelopment`;
};

export const analyzeSentiment = (text: string) => {
  // Simple sentiment analysis based on keyword matching
  const positiveWords = ['great', 'excellent', 'good', 'best', 'amazing', 'wonderful', 'positive'];
  const negativeWords = ['bad', 'poor', 'worst', 'terrible', 'negative', 'awful', 'horrible'];
  
  const words = text.toLowerCase().split(' ');
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });
  
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
};
