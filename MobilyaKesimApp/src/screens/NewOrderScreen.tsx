import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DatabaseService from '../services/database';
import FurnitureDrawing from '../components/FurnitureDrawing';
import { EdgeBanding } from '../types';

type RootStackParamList = {
  NewOrder: undefined;
};

type NewOrderScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewOrder'>;

interface NewOrderScreenProps {
  navigation: NewOrderScreenNavigationProp;
}

const NewOrderScreen: React.FC<NewOrderScreenProps> = ({ navigation }) => {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [quantity, setQuantity] = useState('');
  const [edgeBanding, setEdgeBanding] = useState<EdgeBanding>({
    top: false,
    right: false,
    bottom: false,
    left: false,
  });
  const [showDrawing, setShowDrawing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleDimensionChange = () => {
    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    
    if (lengthNum > 0 && widthNum > 0) {
      setShowDrawing(true);
    } else {
      setShowDrawing(false);
    }
  };

  const toggleEdgeBanding = (edge: keyof EdgeBanding) => {
    setEdgeBanding(prev => ({
      ...prev,
      [edge]: !prev[edge]
    }));
  };

  const handleSubmit = async () => {
    if (!length.trim() || !width.trim() || !quantity.trim()) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const quantityNum = parseInt(quantity);

    if (lengthNum <= 0 || widthNum <= 0 || quantityNum <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli değerler girin');
      return;
    }

    if (!user) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı');
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        length: lengthNum,
        width: widthNum,
        quantity: quantityNum,
        edgeBanding
      };

      const success = await DatabaseService.createOrder(user.id, orderData);
      
      if (success) {
        Alert.alert(
          'Başarılı',
          'Siparişiniz oluşturuldu ve ödeme bekleniyor durumunda',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Hata', 'Sipariş oluşturulurken bir hata oluştu');
      }
    } catch (error) {
      Alert.alert('Hata', 'Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Yeni Sipariş</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.dimensionsContainer}>
              <Text style={styles.sectionTitle}>Ölçüler</Text>
              
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Boy (cm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={length}
                    onChangeText={(text) => {
                      setLength(text);
                      setTimeout(handleDimensionChange, 100);
                    }}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>En (cm)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={width}
                    onChangeText={(text) => {
                      setWidth(text);
                      setTimeout(handleDimensionChange, 100);
                    }}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Adet</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {showDrawing && (
              <View style={styles.drawingContainer}>
                <Text style={styles.sectionTitle}>2D Çizim</Text>
                <FurnitureDrawing
                  length={parseFloat(length)}
                  width={parseFloat(width)}
                  edgeBanding={edgeBanding}
                />
              </View>
            )}

            {showDrawing && (
              <View style={styles.edgeBandingContainer}>
                <Text style={styles.sectionTitle}>Kenar Bantı Seçimi</Text>
                <Text style={styles.edgeBandingHelp}>
                  Bantlanmasını istediğiniz kenarları seçin
                </Text>
                
                <View style={styles.edgeBandingButtons}>
                  <TouchableOpacity
                    style={[
                      styles.edgeBandingButton,
                      edgeBanding.top && styles.edgeBandingButtonActive
                    ]}
                    onPress={() => toggleEdgeBanding('top')}
                  >
                    <Text style={[
                      styles.edgeBandingButtonText,
                      edgeBanding.top && styles.edgeBandingButtonTextActive
                    ]}>
                      Üst Kenar
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.edgeBandingButton,
                      edgeBanding.right && styles.edgeBandingButtonActive
                    ]}
                    onPress={() => toggleEdgeBanding('right')}
                  >
                    <Text style={[
                      styles.edgeBandingButtonText,
                      edgeBanding.right && styles.edgeBandingButtonTextActive
                    ]}>
                      Sağ Kenar
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.edgeBandingButton,
                      edgeBanding.bottom && styles.edgeBandingButtonActive
                    ]}
                    onPress={() => toggleEdgeBanding('bottom')}
                  >
                    <Text style={[
                      styles.edgeBandingButtonText,
                      edgeBanding.bottom && styles.edgeBandingButtonTextActive
                    ]}>
                      Alt Kenar
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.edgeBandingButton,
                      edgeBanding.left && styles.edgeBandingButtonActive
                    ]}
                    onPress={() => toggleEdgeBanding('left')}
                  >
                    <Text style={[
                      styles.edgeBandingButtonText,
                      edgeBanding.left && styles.edgeBandingButtonTextActive
                    ]}>
                      Sol Kenar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Sipariş Oluşturuluyor...' : 'Sipariş Oluştur'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    paddingRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  dimensionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  drawingContainer: {
    marginBottom: 20,
  },
  edgeBandingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  edgeBandingHelp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  edgeBandingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  edgeBandingButton: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 10,
  },
  edgeBandingButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  edgeBandingButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  edgeBandingButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewOrderScreen;