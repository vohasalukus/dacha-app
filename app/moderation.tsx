import React, { useState, useCallback, useEffect } from 'react';
import {
    View, Text, Button, FlatList, StyleSheet, TouchableOpacity,
    Alert, RefreshControl, Platform, ToastAndroid
} from 'react-native';
import { useHouseStore, House, HouseStatus } from '../store/houseStore';
import { useNavigation } from '@react-navigation/native';

export default function ModerationScreen() {
    const houses = useHouseStore(s => s.houses);
    const updateStatus = useHouseStore(s => s.updateStatus);
    const fetchHouses = useHouseStore(s => s.fetchHouses);
    const [filter, setFilter] = useState<HouseStatus | 'all'>('all');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchHouses();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchHouses().finally(() => {
            setRefreshing(false);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Список обновлён', ToastAndroid.SHORT);
            } else {
                Alert.alert('Обновлено');
            }
        });
    }, []);

    const filtered = filter === 'all' ? houses : houses.filter(h => h.status === filter);

    const handleBulk = (status: HouseStatus) => {
        const pending = houses.filter(h => h.status === 'pending').map(h => h.id);
        if (pending.length === 0) return Alert.alert('Нет новых заявок');
        Alert.alert(
            `${status === 'approved' ? 'Одобрить' : 'Отклонить'} все`,
            `Подтвердите действие для ${pending.length} заявок`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Да', onPress: async () => {
                        for (const id of pending) await updateStatus(id, status);
                        ToastAndroid.show('Обработано', ToastAndroid.SHORT);
                    }
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: House }) => (
        <View style={styles.card}>
            <TouchableOpacity
                onPress={() => navigation.navigate('HouseDetail', { id: item.id })}
            >
                <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={[styles.status, {
                color: item.status === 'approved' ? 'green' :
                    item.status === 'rejected' ? 'red' : '#555',
            }]}>
                Статус: {item.status === 'pending' ? 'Новая' : item.status === 'approved' ? 'Одобрена' : 'Отклонена'}
            </Text>
            {item.status === 'pending' && (
                <View style={styles.actions}>
                    <Button title="Одобрить" color="green" onPress={() => updateStatus(item.id, 'approved')} />
                    <Button title="Отклонить" color="red" onPress={() => updateStatus(item.id, 'rejected')} />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Модерация заявок</Text>

            <View style={styles.filters}>
                {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f === 'all' ? 'Все' : f === 'pending' ? 'Новые' : f === 'approved' ? 'Одобрённые' : 'Отклонённые'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {filter === 'pending' && (
                <View style={styles.bulkActions}>
                    <Button title="Одобрить все" onPress={() => handleBulk('approved')} />
                    <Button title="Отклонить все" onPress={() => handleBulk('rejected')} />
                </View>
            )}

            <FlatList
                data={filtered}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    filters: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    filterBtn: {
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#888',
        marginRight: 8,
        marginBottom: 8,
    },
    filterBtnActive: { backgroundColor: '#333' },
    filterText: { color: '#333' },
    filterTextActive: { color: '#fff' },
    bulkActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    name: { fontSize: 18, fontWeight: '600', color: '#0066cc' },
    desc: { marginVertical: 8, color: '#555' },
    status: { marginBottom: 8 },
    actions: { flexDirection: 'row', justifyContent: 'space-around' },
});
