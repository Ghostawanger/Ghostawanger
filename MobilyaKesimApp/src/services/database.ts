import * as SQLite from 'expo-sqlite';
import { User, Order, OrderInput, EdgeBanding } from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('mobilya_kesim.db');
    this.initTables();
  }

  private initTables() {
    // Users table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        is_manager INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        length REAL NOT NULL,
        width REAL NOT NULL,
        quantity INTEGER NOT NULL,
        edge_banding TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Create default admin user if not exists
    this.createDefaultAdmin();
  }

  private createDefaultAdmin() {
    try {
      const existingAdmin = this.db.getFirstSync(
        'SELECT id FROM users WHERE is_manager = 1'
      );
      
      if (!existingAdmin) {
        this.db.runSync(
          'INSERT INTO users (phone, name, password, is_manager) VALUES (?, ?, ?, ?)',
          ['admin', 'Yönetici', '123456', 1]
        );
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  }

  // User operations
  async authenticateUser(phone: string, password: string): Promise<User | null> {
    try {
      const result = this.db.getFirstSync(
        'SELECT id, phone, name, is_manager, created_at FROM users WHERE phone = ? AND password = ?',
        [phone, password]
      ) as any;

      if (result) {
        return {
          id: result.id,
          phone: result.phone,
          name: result.name,
          isManager: result.is_manager === 1,
          createdAt: result.created_at
        };
      }
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  async createUser(phone: string, name: string, password: string): Promise<boolean> {
    try {
      this.db.runSync(
        'INSERT INTO users (phone, name, password) VALUES (?, ?, ?)',
        [phone, name, password]
      );
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  // Order operations
  async createOrder(userId: number, orderData: OrderInput): Promise<boolean> {
    try {
      const edgeBandingJson = JSON.stringify(orderData.edgeBanding);
      
      this.db.runSync(
        'INSERT INTO orders (user_id, length, width, quantity, edge_banding, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, orderData.length, orderData.width, orderData.quantity, edgeBandingJson, 'payment_pending']
      );
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      return false;
    }
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    try {
      const results = this.db.getAllSync(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      ) as any[];

      return results.map(row => ({
        id: row.id,
        userId: row.user_id,
        length: row.length,
        width: row.width,
        quantity: row.quantity,
        edgeBanding: JSON.parse(row.edge_banding),
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const results = this.db.getAllSync(
        'SELECT * FROM orders ORDER BY created_at DESC'
      ) as any[];

      return results.map(row => ({
        id: row.id,
        userId: row.user_id,
        length: row.length,
        width: row.width,
        quantity: row.quantity,
        edgeBanding: JSON.parse(row.edge_banding),
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return [];
    }
  }

  async updateOrderStatus(orderId: number, status: string): Promise<boolean> {
    try {
      this.db.runSync(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, orderId]
      );
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }
}

export default new DatabaseService();