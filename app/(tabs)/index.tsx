import { useRouter } from 'expo-router';
import React from 'react';
import { HomeScreen } from '../../src/screens/HomeScreen';

export default function HomeTab() {
  const router = useRouter();
  
  const navigation = {
    navigate: (routeName: string, params?: any) => {
      if (routeName === 'FlashCardStudy') {
        router.push({
          pathname: '/flashcard-study',
          params: params,
        });
      } else if (routeName === 'SpeechTest') {
        router.push('/speech-test');
      } else if (routeName === 'JLPTCategorySelection') {
        router.push({
          pathname: '/jlpt-category-selection',
          params: params,
        });
      }
    },
    goBack: () => router.back(),
  };

  return <HomeScreen navigation={navigation} />;
}
