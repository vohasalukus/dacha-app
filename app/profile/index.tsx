import { View, Text, Button, StyleSheet } from 'react-native';
import {Link, useNavigation} from 'expo-router'; // для навигации между экранами
import { useAuthStore } from '../../store/authStore';


export default function ProfileScreen() {
    const navigation = useNavigation()
    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);


    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Вы не вошли</Text>
                <Button title="Войти" onPress={() => navigation.navigate('Login')} />
                <Button title="Зарегистрироваться" onPress={() => navigation.navigate('Register')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Мой профиль</Text>

            {/* Информация о пользователе (заглушка) */}
            <Text style={styles.userInfo}>Имя: Иван Иванов</Text>
            <Text style={styles.userInfo}>Email: ivan@example.com</Text>

            {/* Список дач пользователя (можно пока заглушку) */}
            <View style={styles.housesList}>
                <Text style={styles.subtitle}>Мои дачи:</Text>
                {/* Пока заглушка */}
                <Text>1. Дача у озера (На рассмотрении)</Text>
                <Text>2. Дача в горах (Одобрено)</Text>
            </View>

            <View style={styles.container}>
                {/* … инфо о профиле */}
                {user.role === 'admin' && (
                    <Button
                        title="Модерация заявок"
                        onPress={() =>
                            navigation.navigate('Home', { screen: 'Moderation' })
                        }
                    />
                )}
                <Button
                       title="Выйти"
                       onPress={() => {
                         logout();
                         // после логаута возвращаемся на Home
                             navigation.navigate('MainTabs', { screen: 'Home' });
                       }}
                     />
            </View>

            {/* Кнопка для добавления новой дачи */}
            <Button
                title="Добавить свою дачу"
                onPress={() =>
                    navigation.navigate('Home', { screen: 'AddHouse' })
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    userInfo: {
        fontSize: 18,
        marginVertical: 5,
    },
    housesList: {
        marginVertical: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
    },
});
