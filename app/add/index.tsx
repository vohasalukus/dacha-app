import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';

export default function AddHouseScreen() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [contact, setContact] = useState('+998');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState<'UZS' | 'USD'>('UZS');

    // Запрос разрешения на галерею
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Нужно разрешение на доступ к галерее');
            }
        })();
    }, []);

    const handleImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handleSubmit = () => {
        console.log({
            name,
            description,
            image,
            contact,
            location,
            price: `${price} ${currency}`,
        });
        // Здесь будет запрос на бэкенд или запись в Zustand
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
            <Text style={styles.title}>Добавить свою дачу</Text>

            <TextInput
                style={styles.input}
                placeholder="Название дачи"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.descriptionInput}
                placeholder="Описание"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <View style={styles.contactContainer}>
                <Text style={styles.contactPrefix}>+998</Text>
                <TextInput
                    style={styles.contactInput}
                    placeholder="XX XXX XX XX"
                    keyboardType="phone-pad"
                    value={contact.slice(4)}
                    onChangeText={text => setContact('+998' + text)}
                />
            </View>

            <Text style={styles.mapLabel}>Выберите местоположение:</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 41.311081,      // пример: центр Ташкента
                    longitude: 69.240562,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
                onPress={e => setLocation(e.nativeEvent.coordinate)}
            >
                {location && <Marker coordinate={location} />}
            </MapView>

            <View style={styles.priceContainer}>
                <TextInput
                    style={styles.priceInput}
                    placeholder="Цена"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                />
                <TouchableOpacity
                    style={styles.currencyButton}
                    onPress={() => setCurrency(currency === 'UZS' ? 'USD' : 'UZS')}
                >
                    <Text style={styles.currencyText}>{currency}</Text>
                </TouchableOpacity>
            </View>

            <Button title="Выбрать изображение" onPress={handleImagePicker} />
            {image && <Image source={{ uri: image }} style={styles.image} />}

            <Button title="Отправить на модерацию" onPress={handleSubmit} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    descriptionInput: {
        height: 100,             // повыше для описания
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        textAlignVertical: 'top',
        padding: 10,
        marginBottom: 10,
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactPrefix: {
        fontSize: 16,
        paddingHorizontal: 10,
        backgroundColor: '#eee',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        height: 40,
        lineHeight: 40,
    },
    contactInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        paddingHorizontal: 10,
    },
    mapLabel: {
        marginBottom: 5,
        fontSize: 16,
    },
    map: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    priceInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    currencyButton: {
        marginLeft: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    currencyText: {
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginVertical: 10,
        alignSelf: 'center',
    },
});
