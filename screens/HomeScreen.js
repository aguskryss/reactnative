import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Button, TouchableOpacity, FlatList } from 'react-native';
import { getPosts, getCategories, getCategoriesFaltantes, getImage } from '../data/WPService';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const PersonIcon = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
      <FontAwesomeIcon icon={faUser} style={styles.icon} />
    </TouchableOpacity>
  );
};

function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesFaltantes, setCategoriesFaltantes] = useState({});
  const [images, setImages] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const postsData = await getPosts(pageNumber, perPage);
      const categoriesData = await getCategories();
      setPosts(prevPosts => [...prevPosts, ...postsData]);
      setCategories(categoriesData);
    };

    fetchData();
  }, [pageNumber]);

  const loadMorePosts = () => {
    setPageNumber(pageNumber + 1);
  };

  const obtenerCategoriasFaltantes = async (postId) => {
    try {
      const categorias = await getCategoriesFaltantes(postId);
      return categorias;
    } catch (error) {
      console.error('Error al obtener las categorías faltantes:', error);
      return [];
    }
  };

  const actualizarCategoriasFaltantes = async () => {
    const categoriasFaltantesMap = {};
    for (const post of posts) {
      const categoriasFaltantes = await obtenerCategoriasFaltantes(post.id);
      categoriasFaltantesMap[post.id] = categoriasFaltantes;
      if (!images[post.id]) {
        const imagen = await getImage(post.id);
        setImages(prevImages => ({ ...prevImages, [post.id]: imagen }));
      }
    }
    setCategoriesFaltantes(categoriasFaltantesMap);
  };

  useEffect(() => {
    actualizarCategoriasFaltantes();
  }, [posts]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Sin Categoría';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Empresa.org.ar</Text>
      </View>
      <ScrollView style={styles.content}>
        {posts.map((post, index) => (
          <View key={`${post.id}_${index}`} style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title.rendered}</Text>
            {images[post.id] ? (
              <Image source={{ uri: images[post.id] }} style={styles.postImage} />
            ) : (
              <Text style={styles.postImage}>Imagen no disponible</Text>
            )}
            <Text style={styles.postCategory}>
              Categoría: {getCategoryName(post.categories[0]) === 'Sin Categoría'
                ? categoriesFaltantes[post.id]?.join(', ') || 'Ninguna'
                : getCategoryName(post.categories[0])}
            </Text>
          </View>
        ))}
        <Button title="Cargar más posts" onPress={loadMorePosts} />
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    marginBottom: 20,
  },
  headerText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  postCard: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postCategory: {
    fontSize: 14,
    color: '#666',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    backgroundColor: '#ddd',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    borderRadius: 25,
  },
  icon: {
    color: '#fff',
    fontSize: 24,
  },
});

export default HomeScreen;
