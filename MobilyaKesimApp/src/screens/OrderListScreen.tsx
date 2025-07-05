import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DatabaseService from '../services/database';
import { Order } from '../types';

type RootStackParamList = {
  OrderList: undefined;
  NewOrder: undefined;
  OrderDetail: { order: Order };
};

type OrderListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderList'>;

interface OrderListScreenProps {
  navigation: OrderListScreenNavigationProp;
}

const OrderListScreen: React.FC<OrderListScreenProps> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      let orderList: Order[] = [];
      if (user) {
        if (user.isManager) {
          orderList = await DatabaseService.getAllOrders();
        } else {
          orderList = await DatabaseService.getOrdersByUser(user.id);
        }
      }
      setOrders(orderList);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', onPress: logout, style: 'destructive' }
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

  const handleOrderPress = (order: Order) => {
    if (user?.isManager) {
      navigation.navigate('OrderDetail', { order });
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => handleOrderPress(item)}
      disabled={!user?.isManager}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Sipariş #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderDetailText}>
          Boyut: {item.length} x {item.width} cm
        </Text>
        <Text style={styles.orderDetailText}>
          Adet: {item.quantity}
        </Text>
        <Text style={styles.orderDetailText}>
          Tarih: {new Date(item.createdAt).toLocaleDateString('tr-TR')}
        </Text>
      </View>

      <View style={styles.edgeBandingInfo}>
        <Text style={styles.edgeBandingTitle}>Kenar Bantı:</Text>
        <View style={styles.edgeBandingContainer}>
          <Text style={[styles.edgeBandingItem, item.edgeBanding.top && styles.edgeBandingActive]}>
            Üst
          </Text>
          <Text style={[styles.edgeBandingItem, item.edgeBanding.right && styles.edgeBandingActive]}>
            Sağ
          </Text>
          <Text style={[styles.edgeBandingItem, item.edgeBanding.bottom && styles.edgeBandingActive]}>
            Alt
          </Text>
          <Text style={[styles.edgeBandingItem, item.edgeBanding.left && styles.edgeBandingActive]}>
            Sol
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {user?.isManager ? 'Tüm Siparişler' : 'Siparişlerim'}
        </Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz sipariş bulunmuyor</Text>
          </View>
        }
      />

      {!user?.isManager && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('NewOrder')}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f44336',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
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
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 10,
  },
  orderDetailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  edgeBandingInfo: {
    marginTop: 5,
  },
  edgeBandingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  edgeBandingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  edgeBandingItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    color: '#666',
    fontSize: 12,
  },
  edgeBandingActive: {
    backgroundColor: '#667eea',
    color: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default OrderListScreen;