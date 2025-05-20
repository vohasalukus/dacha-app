// app/moderation.tsx
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Platform,
    ToastAndroid,
} from 'react-native';
import { useHouseStore, House, HouseStatus } from '../store/houseStore';
import { useNavigation } from '@react-navigation/native';

export default function ModerationScreen() {
    const houses = useHouseStore((s) => s.houses);
    const updateStatus = useHouseStore((s) => s.updateStatus);
    const [filter, setFilter] = useState<HouseStatus | 'all'>('all');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const filtered = filter === 'all' ? houses : houses.filter((h) => h.status === filter);

    // Bulk actions
    const handleBulk = (status: HouseStatus) => {
        const pendingIds = houses.filter((h) => h.status === 'pending').map((h) => h.id);
        if (pendingIds.length === 0) return Alert.alert('Нет заявок в статусе "Новые"');
        Alert.alert(
            `${status === 'approved' ? 'Одобрить' : 'Отклонить'} все`,
            `Вы уверены, что хотите ${status === 'approved' ? 'одобрить' : 'отклонить'} все новые заявки?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Да',
                    onPress: () => {
                        pendingIds.forEach((id) => updateStatus(id, status));
                        const msg = `Обработано ${pendingIds.length} заявки(ок)`;
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(msg, ToastAndroid.SHORT);
                        } else {
                            Alert.alert(msg);
                        }
                    },
                },
            ]
        );
    };

    // Pull to refresh simulation
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            if (Platform.OS === 'android') {
                ToastAndroid.show('Список обновлён', ToastAndroid.SHORT);
            }
        }, 500);
    }, []);

    const renderItem = ({ item }: { item: House }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('Home', { screen: 'HouseDetail', params: { id: item.id } })}>
                <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.status}>Статус: {item.status}</Text>
            {item.status === 'pending' && (
                <View style={styles.actions}>
                    <Button title="Одобрить" onPress={() => updateStatus(item.id, 'approved')} />
                    <Button title="Отклонить" onPress={() => updateStatus(item.id, 'rejected')} />
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Модерация заявок</Text>

            <View style={styles.filters}>
                {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f === 'all'
                                ? 'Все'
                                : f === 'pending'
                                    ? 'Новые'
                                    : f === 'approved'
                                        ? 'Одобрённые'
                                        : 'Отклонённые'}
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
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    filters: { flexDirection: 'row', marginBottom: 12, flexWrap: 'wrap' },
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
    name: { fontSize: 18, fontWeight: '600', color: '#0066cc', marginBottom: 4 },
    desc: { marginVertical: 8, color: '#555' },
    status: { marginBottom: 8 },
    actions: { flexDirection: 'row', justifyContent: 'space-around' },
});
