export async function geocodeAddressToCoords(address: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
            {
                headers: {
                    'User-Agent': 'dacha-app/1.0 (your@email.com)', // можно любую строку
                },
            }
        );

        const data = await response.json();
        if (data && data.length > 0) {
            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
            };
        }
        return null;
    } catch (err) {
        console.error('Ошибка геокодинга:', err);
        return null;
    }
}
