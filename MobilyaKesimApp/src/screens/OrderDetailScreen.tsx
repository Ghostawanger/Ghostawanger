import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DatabaseService from '../services/database';
import FurnitureDrawing from '../components/FurnitureDrawing';
import { Order } from '../types';

type RootStackParamList = {
  OrderDetail: { order: Order };
};

type OrderDetailScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;
type OrderDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetail'>;

interface OrderDetailScreenProps {
  route: OrderDetailScreenRouteProp;
  navigation: OrderDetailScreenNavigationProp;
}

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ navigation, route }) => {
  const [order, setOrder] = useState<Order>(route.params.order);
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const success = await DatabaseService.updateOrderStatus(order.id, newStatus);
      if (success) {
        setOrder(prev => ({ ...prev, status: newStatus as any }));
        Alert.alert('Başarılı', 'Sipariş durumu güncellendi');
      } else {
        Alert.alert('Hata', 'Sipariş durumu güncellenemedi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    Alert.alert(
      'Siparişi Onayla',
      'Bu siparişi onaylamak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Onayla', onPress: () => updateOrderStatus('approved') }
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Siparişi Reddet',
      'Bu siparişi reddetmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Reddet', onPress: () => updateOrderStatus('rejected'), style: 'destructive' }
      ]
    );
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      case 'payment_pending':
        return 'Ödeme Bekleniyor';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'payment_pending':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const canUpdateStatus = order.status === 'payment_pending' || order.status === 'pending';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Sipariş Detayı</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.orderInfo}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Sipariş #{order.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Müşteri ID:</Text>
              <Text style={styles.infoValue}>{order.userId}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Boyutlar:</Text>
              <Text style={styles.infoValue}>{order.length} x {order.width} cm</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Adet:</Text>
              <Text style={styles.infoValue}>{order.quantity}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Sipariş Tarihi:</Text>
              <Text style={styles.infoValue}>
                {new Date(order.createdAt).toLocaleDateString('tr-TR')} - 
                {new Date(order.createdAt).toLocaleTimeString('tr-TR')}
              </Text>
            </View>

            {order.updatedAt !== order.createdAt && (
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Güncelleme Tarihi:</Text>
                <Text style={styles.infoValue}>
                  {new Date(order.updatedAt).toLocaleDateString('tr-TR')} - 
                  {new Date(order.updatedAt).toLocaleTimeString('tr-TR')}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.drawingSection}>
            <Text style={styles.sectionTitle}>2D Çizim</Text>
            <FurnitureDrawing
              length={order.length}
              width={order.width}
              edgeBanding={order.edgeBanding}
            />
          </View>

          <View style={styles.edgeBandingSection}>
            <Text style={styles.sectionTitle}>Kenar Bantı Detayları</Text>
            <View style={styles.edgeBandingGrid}>
              <View style={styles.edgeBandingItem}>
                <Text style={styles.edgeBandingLabel}>Üst Kenar:</Text>
                <Text style={[
                  styles.edgeBandingValue,
                  order.edgeBanding.top ? styles.edgeBandingActive : styles.edgeBandingInactive
                ]}>
                  {order.edgeBanding.top ? 'Var' : 'Yok'}
                </Text>
              </View>
              
              <View style={styles.edgeBandingItem}>
                <Text style={styles.edgeBandingLabel}>Sağ Kenar:</Text>
                <Text style={[
                  styles.edgeBandingValue,
                  order.edgeBanding.right ? styles.edgeBandingActive : styles.edgeBandingInactive
                ]}>
                  {order.edgeBanding.right ? 'Var' : 'Yok'}
                </Text>
              </View>
              
              <View style={styles.edgeBandingItem}>
                <Text style={styles.edgeBandingLabel}>Alt Kenar:</Text>
                <Text style={[
                  styles.edgeBandingValue,
                  order.edgeBanding.bottom ? styles.edgeBandingActive : styles.edgeBandingInactive
                ]}>
                  {order.edgeBanding.bottom ? 'Var' : 'Yok'}
                </Text>
              </View>
              
              <View style={styles.edgeBandingItem}>
                <Text style={styles.edgeBandingLabel}>Sol Kenar:</Text>
                <Text style={[
                  styles.edgeBandingValue,
                  order.edgeBanding.left ? styles.edgeBandingActive : styles.edgeBandingInactive
                ]}>
                  {order.edgeBanding.left ? 'Var' : 'Yok'}
                </Text>
              </View>
            </View>
          </View>

          {canUpdateStatus && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={handleApprove}
                disabled={loading}
              >
                <Text style={styles.actionButtonText}>
                  {loading ? 'Güncelleniyor...' : 'Onayla'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={handleReject}
                disabled={loading}
              >
                <Text style={styles.actionButtonText}>
                  {loading ? 'Güncelleniyor...' : 'Reddet'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  content: {
    padding: 20,
  },
  orderInfo: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  drawingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  edgeBandingSection: {
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
  edgeBandingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  edgeBandingItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  edgeBandingLabel: {
    fontSize: 14,
    color: '#666',
  },
  edgeBandingValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  edgeBandingActive: {
    color: '#4CAF50',
  },
  edgeBandingInactive: {
    color: '#F44336',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderDetailScreen;