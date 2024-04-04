import axios from 'axios';

const WP_API_URL = 'https://empresa.org.ar/wp-json/wp/v2'; // Cambia esto por la URL de tu sitio

export const getPosts = async (pageNumber, perPage) => {
  try {
    const response = await axios.get(`${WP_API_URL}/posts?page=${pageNumber}&per_page=${perPage}&orderby=date&order=desc`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    throw error;
  }
};


// Nueva función para obtener categorías
export const getCategories = async () => {
  try {
    const response = await axios.get(`${WP_API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    throw error;
  }
};

// En la función getCategoriesFaltantes en WPService.js
export const getCategoriesFaltantes = async (postId) => {
  try {
    const response = await axios.get(`${WP_API_URL}/categories?post=${postId}`);
    const categories = response.data.map(category => category.name); // Extraer solo los nombres de las categorías
    return categories;
  } catch (error) {
    console.error('Error al obtener las categorías faltantes:', error);
    throw error;
  }
};

export const getImage = async (postId) => {
  try {
    const response = await axios.get(`${WP_API_URL}/media?parent=${postId}`);
    const imageData = response.data;

    // Si hay imágenes disponibles, devuelve la URL de la primera imagen
    if (imageData.length > 0) {
      return imageData[0].source_url;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    throw error;
  }
};