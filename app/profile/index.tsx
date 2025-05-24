import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useMyDachaStore } from '../../store/useMyDachaStore';
import { RefreshControl } from 'react-native';




export default function ProfileScreen() {
    const navigation = useNavigation();
    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);
    const { myDachas, fetchMyDachas } = useMyDachaStore();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMyDachas();
        setRefreshing(false);
    };


    useEffect(() => {
        fetchMyDachas();
    }, []);

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
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.title}>👤 Мой профиль</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Роль:</Text>
                <Text style={styles.value}>
                    {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>Мои дачи:</Text>
                {myDachas.length === 0 ? (
                    <Text style={{ color: '#777' }}>Вы пока не добавили ни одной дачи.</Text>
                ) : (
                    myDachas.map(d => (
                        <TouchableOpacity
                            key={d.id}
                            onPress={() => navigation.navigate('Home', {
                                screen: 'HouseDetail',
                                params: { id: d.id },
                            })}
                            style={styles.dachaItem}
                        >
                            <Text style={styles.dachaText}>• {d.name} ({d.is_verified})</Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>

            {user.role === 'admin' && (
                <View style={styles.section}>
                    <Button
                        title="📋 Модерация заявок"
                        onPress={() => navigation.navigate('Home', { screen: 'Moderation' })}
                    />
                </View>
            )}

            <View style={styles.section}>
                <Button
                    title="➕ Добавить свою дачу"
                    onPress={() => navigation.navigate('Home', { screen: 'AddHouse' })}
                />
            </View>

            <View style={styles.section}>
                <Button
                    title="🚪 Выйти"
                    color="red"
                    onPress={() => {
                        logout();
                        navigation.navigate('MainTabs', { screen: 'Home' });
                    }}
                />
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
    },
    value: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 5,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    dachaItem: {
        paddingVertical: 8,
    },
    dachaText: {
        fontSize: 16,
        color: '#0066cc',
    },
});
