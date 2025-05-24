import React from 'react';
import {
    Modal, View, Text, TextInput, Button, ScrollView,
    StyleSheet, Switch, TouchableOpacity
} from 'react-native';
import { useFilterStore } from '../store/filterStore';

export default function FilterModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const filter = useFilterStore();

    const booleanFields = [
        'wifi', 'alcohol', 'smoking', 'party', 'pets', 'available_only_family',
        'playstation_3', 'playstation_4', 'playstation_5', 'air_conditioner',
        'billiards', 'table_tennis', 'football_field', 'karaoke', 'sauna',
        'jacuzzi', 'turkish_bath', 'indoor_swimming_pool', 'outdoor_swimming_pool'
    ];

    return (
        <Modal visible={visible} animationType="slide">
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Фильтры</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.close}>✕</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Регион"
                    value={filter.region}
                    onChangeText={(text) => filter.set({ region: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Район"
                    value={filter.district}
                    onChangeText={(text) => filter.set({ district: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Город"
                    value={filter.city}
                    onChangeText={(text) => filter.set({ city: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Страна"
                    value={filter.country}
                    onChangeText={(text) => filter.set({ country: text })}
                />

                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginRight: 5 }]}
                        placeholder="Мин. цена"
                        keyboardType="numeric"
                        value={filter.minPrice}
                        onChangeText={(text) => filter.set({ minPrice: text })}
                    />
                    <TextInput
                        style={[styles.input, { flex: 1, marginLeft: 5 }]}
                        placeholder="Макс. цена"
                        keyboardType="numeric"
                        value={filter.maxPrice}
                        onChangeText={(text) => filter.set({ maxPrice: text })}
                    />
                </View>

                <Text style={styles.sectionTitle}>Удобства</Text>
                {booleanFields.map((key) => (
                    <View key={key} style={styles.switchRow}>
                        <Text>{key.replaceAll('_', ' ')}</Text>
                        <Switch
                            value={filter[key as keyof typeof filter] as boolean}
                            onValueChange={(val) => filter.set({ [key]: val })}
                        />
                    </View>
                ))}

                <View style={styles.buttons}>
                    <Button title="Сбросить" onPress={filter.reset} />
                    <Button title="Применить" onPress={onClose} />
                </View>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 20
    },
    close: { fontSize: 24, padding: 8, color: 'red' },
    input: {
        height: 40, borderColor: '#ccc', borderWidth: 1,
        borderRadius: 8, paddingHorizontal: 10, marginBottom: 10
    },
    row: { flexDirection: 'row', marginBottom: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    switchRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10
    },
    buttons: { marginTop: 20, gap: 10 },
});
