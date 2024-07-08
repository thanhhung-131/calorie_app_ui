import axios from 'axios';

class AIService {
  async predictImage(imageUri) {
    try {
      const formData = new FormData();
      formData.append('image_url', imageUri);

      const response = await axios.post(
        'https://f9df-2402-9d80-404-33f3-19ff-1be0-82c-47de.ngrok-free.app/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to predict image');
      }

      return response.data;
      // Xử lý kết quả dự đoán ở đây
    } catch (error) {
      console.error('Error predicting image:', error.response ? error.response.data : error.message);
    }
  }
}

export default new AIService();
