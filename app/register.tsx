// app/register.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const navigation = useNavigation();

    const register = useAuthStore(s => s.register);

    const handleRegister = async () => {
        if (password !== rePassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают');
            return;
        }

        try {
            await register(email, username, password, rePassword);
            navigation.navigate('MainTabs', { screen: 'Home' });
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            Alert.alert('Ошибка', 'Не удалось зарегистрироваться');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Имя пользователя"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Повторите пароль"
                secureTextEntry
                value={rePassword}
                onChangeText={setRePassword}
            />

            <Button title="Зарегистрироваться" onPress={handleRegister} />
            <Button title="Уже есть аккаунт?" onPress={() => navigation.navigate('Login')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
});
