# Mobilya Kesim Uygulaması

Bu uygulama, mobilya kesim siparişlerini yönetmek için geliştirilmiş bir React Native/Expo uygulamasıdır. Hem iOS hem de Android'de çalışır.

## Özellikler

- **Kullanıcı Girişi**: Telefon numarası ve şifre ile giriş
- **Sipariş Listesi**: Kullanıcının siparişlerini görüntüleme
- **Yeni Sipariş**: Boy, en, adet ve kenar bantı seçimi ile sipariş oluşturma
- **2D Çizim**: Sipariş boyutlarını gösteren görsel çizim
- **Kenar Bantı Seçimi**: Hangi kenarların bantlanacağını seçme
- **Yönetici Paneli**: Siparişleri onaylama/reddetme
- **Veritabanı**: SQLite ile yerel veri depolama

## Kurulum

1. Projeyi klonlayın
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

## Çalıştırma

### Geliştirme Ortamı
```bash
npm start
```

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Web
```bash
npm run web
```

## Demo Hesaplar

Uygulama varsayılan olarak aşağıdaki hesapla gelir:

- **Yönetici**: 
  - Telefon: `admin`
  - Şifre: `123456`

## Kullanım

### Kullanıcı İşlemleri

1. **Giriş**: Telefon numarası ve şifre ile giriş yapın
2. **Sipariş Görüntüleme**: Ana ekranda mevcut siparişlerinizi görün
3. **Yeni Sipariş**: Sağ alttaki + butonuna tıklayarak yeni sipariş oluşturun
4. **Sipariş Detayları**: 
   - Boy ve en ölçülerini girin
   - Adet belirtin
   - Kenar bantı seçimi yapın
   - 2D çizimi görüntüleyin
   - Siparişi oluşturun

### Yönetici İşlemleri

1. **Tüm Siparişler**: Yönetici olarak giriş yapınca tüm siparişleri görürsünüz
2. **Sipariş Onaylama**: Bir siparişe tıklayarak detaylarını görün ve onaylayın/reddedin
3. **Sipariş Durumları**:
   - Ödeme Bekleniyor (Yeni siparişler)
   - Bekliyor
   - Onaylandı
   - Reddedildi

## Teknolojiler

- **React Native**: Mobil uygulama geliştirme
- **Expo**: Geliştirme ve derleme platformu
- **TypeScript**: Tip güvenliği
- **SQLite**: Yerel veritabanı
- **React Navigation**: Sayfa geçişleri
- **React Native SVG**: 2D çizim
- **AsyncStorage**: Yerel veri depolama

## Proje Yapısı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
├── context/            # React Context (AuthContext)
├── screens/            # Uygulama ekranları
├── services/           # Veritabanı ve API servisleri
├── types/              # TypeScript tip tanımları
└── utils/              # Yardımcı fonksiyonlar
```

## Veritabanı Yapısı

### Users Tablosu
- id (Primary Key)
- phone (Unique)
- name
- password
- is_manager (Boolean)
- created_at

### Orders Tablosu
- id (Primary Key)
- user_id (Foreign Key)
- length (Float)
- width (Float)
- quantity (Integer)
- edge_banding (JSON)
- status (String)
- created_at
- updated_at

## Geliştirme Notları

- Uygulama Expo SDK 53 kullanır
- SQLite veritabanı cihazda yerel olarak saklanır
- Kenar bantı bilgileri JSON formatında saklanır
- 2D çizim SVG kullanılarak gerçekleştirilir

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.