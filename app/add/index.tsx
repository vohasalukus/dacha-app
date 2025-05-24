import React, { useState, useEffect } from 'react';
import {
    View, TextInput, Button, StyleSheet, Text, Image, ScrollView,
    TouchableOpacity, KeyboardAvoidingView, Platform, Switch, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';
import {useNavigation} from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import {geocodeAddressToCoords} from "@/utils/geocodingUtils";
import * as Location from 'expo-location';



export default function AddHouseScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [contact, setContact] = useState('+998');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [priceWeek, setPriceWeek] = useState('');
    const [priceWeekend, setPriceWeekend] = useState('');
    const [roomCount, setRoomCount] = useState('');
    const [singleBedRoomCount, setSingleBedRoomCount] = useState('');
    const [doubleBedRoomCount, setDoubleBedRoomCount] = useState('');
    const [enterTime, setEnterTime] = useState<Date | undefined>();
    const [exitTime, setExitTime] = useState<Date | undefined>();
    const [showEnterPicker, setShowEnterPicker] = useState(false);
    const [showExitPicker, setShowExitPicker] = useState(false);
    const [squareMeter, setSquareMeter] = useState('');
    const [region, setRegion] = useState('');
    const [district, setDistrict] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const navigation = useNavigation();
    const [address, setAddress] = useState('');

    const [features, setFeatures] = useState({
        alcohol: false,
        wifi: false,
        smoking: false,
        party: false,
        pets: false,
        loudly_music: false,
        available_only_family: false,
        playstation_5: false,
        playstation_4: false,
        playstation_3: false,
        air_conditioner: false,
        billiards: false,
        table_tennis: false,
        football_field: false,
        karaoke: false,
        sauna: false,
        jacuzzi: false,
        turkish_bath: false,
        indoor_swimming_pool: false,
        outdoor_swimming_pool: false,
    });

    const token = useAuthStore(s => s.user?.access);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets.length > 0) {
            if (images.length < 10) {
                setImages([...images, result.assets[0].uri]);
            } else {
                Alert.alert('Максимум 10 изображений');
            }
        }
    };

    const handleSubmit = async () => {

        if (!token) {
            Alert.alert('Ошибка', 'Вы не авторизованы');
            return;
        }

        if (!location || !location.latitude || !location.longitude) {
            Alert.alert('Ошибка', 'Вы не указали местоположение дачи');
            return;
        }


        const formData = new FormData();

        formData.append('name', name);
        formData.append('category', '1');
        formData.append('description', description);
        formData.append('contact', contact);
        formData.append('week_day_price', String(Number(priceWeek)));
        formData.append('week_end_price', String(Number(priceWeekend)));
        formData.append('room_count', String(Number(roomCount)));
        formData.append('single_bed_room_count', String(Number(singleBedRoomCount)));
        formData.append('double_bed_room_count', String(Number(doubleBedRoomCount)));
        formData.append('square_meter', String(Number(squareMeter)));
        formData.append('enter_time', enterTime?.toTimeString().slice(0, 5) || '14:00');
        formData.append('exit_time', exitTime?.toTimeString().slice(0, 5) || '12:00');
        formData.append('region', region);
        formData.append('district', district);
        formData.append('city', city);
        formData.append('country', country);
        formData.append('is_verified', 'new');

        if (location) {
            formData.append('latitude', String(Number(location.latitude)));
            formData.append('longitude', String(Number(location.longitude)));
        }


        Object.entries(features).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        images.forEach((uri, index) => {
            const filename = uri.split('/').pop()!;
            const type = 'image/jpeg';
            formData.append(`image${index + 1}`, {
                uri,
                name: filename,
                type: 'image/*', // заменяем
            } as any);
        });


        try {
            console.log('📍 Итоговое location:', location);
            await axios.post('http://10.0.2.2:8000/dacha/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            Alert.alert('Успех', 'Дача отправлена на модерацию', [
                {
                    text: 'ОК',
                    onPress: () => navigation.navigate('MainTabs', { screen: 'Profile' }),
                },
            ]);
        } catch (error) {
            console.error('Ошибка отправки:', error);
            Alert.alert('Ошибка', 'Не удалось отправить дачу');
        }
        console.log('📤 Отправляемые данные:');
        formData.forEach((value, key) => {
            console.log(`${key}:`, value);
        });
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Добавить дачу</Text>

                <TextInput style={styles.input} placeholder="Название" value={name} onChangeText={setName} />
                <TextInput style={styles.input} placeholder="Описание" value={description} onChangeText={setDescription} multiline />

                <TextInput
                    keyboardType="numeric"
                    value={priceWeek}
                    onChangeText={(text) => setPriceWeek(text.replace(/[^0-9]/g, ''))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Цена выходные"
                    keyboardType="numeric"
                    value={priceWeekend}
                    onChangeText={(text) => setPriceWeekend(text.replace(/[^0-9]/g, ''))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Комнат всего"
                    keyboardType="numeric"
                    value={roomCount}
                    onChangeText={(text) => setRoomCount(text.replace(/[^0-9]/g, ''))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Одноместных комнат"
                    keyboardType="numeric"
                    value={singleBedRoomCount}
                    onChangeText={(text) => setSingleBedRoomCount(text.replace(/[^0-9]/g, ''))}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Двухместных комнат"
                    keyboardType="numeric"
                    value={doubleBedRoomCount}
                    onChangeText={(text) => setDoubleBedRoomCount(text.replace(/[^0-9]/g, ''))}
                />

                <Text style={styles.label}>Время заезда</Text>
                <TouchableOpacity onPress={() => setShowEnterPicker(true)} style={styles.timeBox}>
                    <Text>{enterTime ? enterTime.toLocaleTimeString().slice(0, 5) : 'Выбрать время'}</Text>
                </TouchableOpacity>

                {showEnterPicker && (
                    <DateTimePicker
                        mode="time"
                        value={enterTime || new Date()}
                        is24Hour
                        display="default"
                        onChange={(_, selected) => {
                            setShowEnterPicker(Platform.OS === 'ios');
                            if (selected) setEnterTime(selected);
                        }}
                    />
                )}

                <Text style={styles.label}>Время выезда</Text>
                <TouchableOpacity onPress={() => setShowExitPicker(true)} style={styles.timeBox}>
                    <Text>{exitTime ? exitTime.toLocaleTimeString().slice(0, 5) : 'Выбрать время'}</Text>
                </TouchableOpacity>

                {showExitPicker && (
                    <DateTimePicker
                        mode="time"
                        value={exitTime || new Date()}
                        is24Hour
                        display="default"
                        onChange={(_, selected) => {
                            setShowExitPicker(Platform.OS === 'ios');
                            if (selected) setExitTime(selected);
                        }}
                    />
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Площадь (м²)"
                    keyboardType="numeric"
                    value={squareMeter}
                    onChangeText={(text) => setSquareMeter(text.replace(/[^0-9]/g, ''))}
                />


                <TextInput style={styles.input} placeholder="Область" value={region} onChangeText={setRegion} />
                <TextInput style={styles.input} placeholder="Район" value={district} onChangeText={setDistrict} />
                <TextInput style={styles.input} placeholder="Город" value={city} onChangeText={setCity} />
                <TextInput style={styles.input} placeholder="Страна" value={country} onChangeText={setCountry} />

                <TextInput
                    style={styles.input}
                    placeholder="Введите адрес"
                    value={address}
                    onChangeText={setAddress}
                />

                <Button
                    title="Найти координаты"
                    onPress={async () => {
                        const coords = await geocodeAddressToCoords(address);
                        if (coords) {
                            setLocation(coords);
                        } else {
                            Alert.alert('Не удалось найти координаты по адресу');
                        }
                    }}
                />

                <Button
                    title="Определить мою локацию"
                    onPress={async () => {
                        const { status } = await Location.requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Нет доступа к геолокации');
                            return;
                        }

                        const locationResult = await Location.getCurrentPositionAsync({});
                        const coords = {
                            latitude: locationResult.coords.latitude,
                            longitude: locationResult.coords.longitude,
                        };
                        console.log('📍 Моя локация:', coords);
                        setLocation(coords);

                    }}
                />



                <Text style={styles.label}>Выберите местоположение</Text>
                <MapView
                    style={styles.map}
                    region={
                        location
                            ? {
                                ...location,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }
                            : {
                                latitude: 41.311081,
                                longitude: 69.240562,
                                latitudeDelta: 0.1,
                                longitudeDelta: 0.1,
                            }
                    }
                    onPress={e => setLocation(e.nativeEvent.coordinate)}
                >
                    {location && <Marker coordinate={location} />}
                </MapView>


                <Button title="Добавить изображение" onPress={pickImage} />
                {images.map((uri, idx) => (
                    <Image key={idx} source={{ uri }} style={styles.image} />
                ))}

                <Text style={styles.label}>Удобства</Text>
                {Object.entries(features).map(([key, value]) => (
                    <View key={key} style={styles.switchRow}>
                        <Text style={styles.switchLabel}>{key.replaceAll('_', ' ')}</Text>
                        <Switch value={value} onValueChange={v => setFeatures(prev => ({ ...prev, [key]: v }))} />
                    </View>
                ))}

                <Button title="Отправить на модерацию" onPress={handleSubmit} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    map: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
        fontWeight: '600',
    },
    image: {
        width: '100%',
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
    timeBox: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
        marginTop: 10,
    },

});
