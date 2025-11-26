# Firebase Vocabulary Import Service

Service để import dữ liệu từ vựng tiếng Nhật vào Firebase Firestore.

## Cài đặt

1. **Cài đặt Firebase SDK** (đã cài):
```bash
npm install firebase
```

2. **Cấu hình Firebase**:

Mở file `src/config/firebase.ts` và thay thế với thông tin Firebase project của bạn:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Lấy thông tin này từ Firebase Console:
- Vào [Firebase Console](https://console.firebase.google.com/)
- Chọn project của bạn
- Vào **Project Settings** > **General** > **Your apps**
- Copy config từ phần "Firebase SDK snippet"

## Format dữ liệu JSON

File JSON cần có format như sau:

```json
{
  "documents": [
    {
      "id": "n5-001",
      "category": "pronoun",
      "kanji": "私",
      "kana": "わたし",
      "romaji": "watashi",
      "meaning_vi": "tôi",
      "pos": "pronoun",
      "notes": "Trang trọng / trung tính",
      "jlpt": "N5"
    },
    {
      "id": "n5-002",
      "category": "pronoun",
      "kanji": "僕",
      "kana": "ぼく",
      "romaji": "boku",
      "meaning_vi": "tôi (nam)",
      "pos": "pronoun",
      "notes": "Thân mật nam",
      "jlpt": "N5"
    }
  ]
}
```

### Các trường bắt buộc:
- `id`: ID duy nhất cho mỗi từ vựng
- `kana`: Hiragana/Katakana
- `meaning_vi`: Nghĩa tiếng Việt

### Các trường tùy chọn:
- `category`: Danh mục (pronoun, verb, adjective, etc.)
- `kanji`: Chữ Kanji (có thể để trống "")
- `romaji`: Phiên âm La-tinh
- `pos`: Part of speech (từ loại)
- `notes`: Ghi chú thêm
- `jlpt`: Cấp độ JLPT (N5, N4, N3, N2, N1)

## Cách sử dụng

### Phương pháp 1: Sử dụng script command-line

1. **Chuẩn bị file JSON**:
   - Đặt file JSON trong thư mục project
   - Ví dụ: `vocabulary_n5.json`

2. **Chạy script import**:
```bash
npx ts-node src/scripts/importVocabulary.ts vocabulary_n5.json
```

3. **Xem kết quả**:
   - Script sẽ hiển thị progress và kết quả import
   - Số lượng thành công/thất bại
   - Chi tiết lỗi (nếu có)

### Phương pháp 2: Sử dụng UI trong app

1. **Thêm screen vào navigation** (tùy chọn):

Thêm import screen vào tab navigation của bạn:

```typescript
import VocabularyImportScreen from '../screens/VocabularyImportScreen';

// Trong tab navigator
<Tab.Screen name="import" component={VocabularyImportScreen} />
```

2. **Sử dụng screen**:
   - Mở app và đi đến Import screen
   - Nhấn "Paste & Import JSON"
   - Paste JSON data vào
   - Nhấn "Import"

### Phương pháp 3: Sử dụng service trực tiếp trong code

```typescript
import { VocabularyImportService } from './services/vocabularyImportService';

// Import từ JSON string
const jsonData = '{"documents": [...]}';
const results = await VocabularyImportService.importFromFile(jsonData);

// Hoặc import từ object
const data = { documents: [...] };
const results = await VocabularyImportService.importVocabulary(data);

// Lấy vocabulary theo JLPT level
const n5Words = await VocabularyImportService.getByJLPTLevel('N5');

// Lấy vocabulary theo category
const pronouns = await VocabularyImportService.getByCategory('pronoun');

// Lấy tất cả vocabulary
const allWords = await VocabularyImportService.getAll();

// Xóa tất cả vocabulary (cẩn thận!)
const deleteResult = await VocabularyImportService.deleteAll();
```

## Tính năng của Service

### 1. Batch Import
- Tự động chia nhỏ thành các batch 500 items (giới hạn của Firestore)
- Import song song để tăng tốc độ
- Xử lý lỗi riêng lẻ cho từng item

### 2. Validation
- Kiểm tra các trường bắt buộc
- Báo lỗi chi tiết cho từng item thất bại
- Tiếp tục import các item khác khi có lỗi

### 3. Metadata
- Tự động thêm `createdAt` và `updatedAt` timestamp
- Giữ nguyên dữ liệu gốc từ JSON

### 4. Query Functions
- `getByJLPTLevel(level)`: Lấy theo cấp độ JLPT
- `getByCategory(category)`: Lấy theo danh mục
- `getAll()`: Lấy tất cả
- `deleteAll()`: Xóa tất cả (cẩn thận!)

## Cấu trúc Firestore

Dữ liệu sẽ được lưu trong collection `vocabulary`:

```
vocabulary/
  ├── n5-001/
  │   ├── id: "n5-001"
  │   ├── category: "pronoun"
  │   ├── kanji: "私"
  │   ├── kana: "わたし"
  │   ├── romaji: "watashi"
  │   ├── meaning_vi: "tôi"
  │   ├── pos: "pronoun"
  │   ├── notes: "Trang trọng"
  │   ├── jlpt: "N5"
  │   ├── createdAt: "2025-11-26T..."
  │   └── updatedAt: "2025-11-26T..."
  ├── n5-002/
  │   └── ...
  └── ...
```

## Firestore Security Rules

Để bảo vệ dữ liệu, thêm rules sau vào Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Vocabulary collection
    match /vocabulary/{vocabId} {
      // Allow read for all authenticated users
      allow read: if request.auth != null;
      
      // Allow write only for admin users
      allow write: if request.auth != null && 
                     request.auth.token.admin == true;
    }
  }
}
```

## Troubleshooting

### Lỗi: "Failed to parse JSON"
- Kiểm tra format JSON đúng chuẩn
- Sử dụng JSON validator online
- Đảm bảo không có trailing commas

### Lỗi: "Missing required fields"
- Đảm bảo mọi item có `id`, `kana`, `meaning_vi`
- Kiểm tra spelling của field names

### Lỗi: "Permission denied"
- Kiểm tra Firebase Security Rules
- Đảm bảo user đã authenticate
- Kiểm tra quyền write trong Firestore

### Lỗi: "Batch write limit exceeded"
- Service tự động xử lý batch limit
- Nếu vẫn lỗi, giảm BATCH_SIZE trong service

## Performance Tips

1. **Import lớn**: Chia nhỏ file JSON thành nhiều file nhỏ hơn
2. **Testing**: Test với vài items trước khi import hết
3. **Backup**: Backup Firestore trước khi import số lượng lớn
4. **Monitoring**: Xem Firestore Usage trong Firebase Console

## Examples

### Import 800 từ vựng N5:
```bash
npx ts-node src/scripts/importVocabulary.ts vocabulary_n5_full.json
```

### Query trong app:
```typescript
// Lấy tất cả từ N5 cho flashcard
const n5Vocabulary = await VocabularyImportService.getByJLPTLevel('N5');

// Convert sang FlashCard format
const flashcards = n5Vocabulary.map(vocab => ({
  id: vocab.id,
  front: vocab.kanji || vocab.kana,
  back: vocab.meaning_vi,
  reading: vocab.kana,
  category: vocab.category,
  difficulty: 'beginner',
  lastReviewed: new Date(),
  nextReview: new Date(),
  repetitions: 0,
  easeFactor: 2.5,
  interval: 1,
}));
```

## License

MIT
