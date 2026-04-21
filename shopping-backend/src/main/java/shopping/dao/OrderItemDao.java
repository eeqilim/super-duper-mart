package shopping.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import shopping.entity.OrderItem;
import shopping.entity.OrderStatus;

import java.util.List;

@Repository
public class OrderItemDao {

    private final SessionFactory sessionFactory;

    @Autowired
    public OrderItemDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    /**
     * USER: Top x most recently purchased items
     * Excludes canceled orders
     * Tie-breaker: itemId DESC
     */
    public List<OrderItem> findRecentPurchasedItems(Long userId, int limit) {
        return getCurrentSession()
                .createQuery(
                        "SELECT oi FROM OrderItem oi " +
                                "JOIN FETCH oi.product p " +
                                "JOIN oi.order o " +
                                "WHERE o.user.userId = :userId " +
                                "AND o.orderStatus <> :canceledStatus " +
                                "ORDER BY o.datePlaced DESC, oi.itemId DESC",
                        OrderItem.class
                )
                .setParameter("userId", userId)
                .setParameter("canceledStatus", OrderStatus.CANCELED)
                .setMaxResults(limit)
                .getResultList();
    }

    /**
     * USER: Top x most frequently purchased products
     * Excludes canceled orders
     * Returns: [productId, productName, description, totalQuantity, latestPurchasedPrice]
     */
    public List<Object[]> findFrequentPurchasedProducts(Long userId, int limit) {
        return getCurrentSession()
                .createQuery(
                        "SELECT p.productId, p.name, p.description, " +
                                "SUM(oi.quantity), MAX(oi.purchasedPrice) " +
                                "FROM OrderItem oi " +
                                "JOIN oi.product p " +
                                "JOIN oi.order o " +
                                "WHERE o.user.userId = :userId " +
                                "AND o.orderStatus <> :canceledStatus " +
                                "GROUP BY p.productId, p.name, p.description " +
                                "ORDER BY SUM(oi.quantity) DESC, MAX(oi.itemId) DESC",
                        Object[].class
                )
                .setParameter("userId", userId)
                .setParameter("canceledStatus", OrderStatus.CANCELED)
                .setMaxResults(limit)
                .getResultList();
    }

    /**
     * ADMIN: Top x most popular products
     * Includes only COMPLETED orders
     * Returns: [productId, productName, totalSold]
     */
    public List<Object[]> findPopularProducts(int limit) {
        return getCurrentSession()
                .createQuery(
                        "SELECT p.productId, p.name, SUM(oi.quantity) " +
                                "FROM OrderItem oi " +
                                "JOIN oi.product p " +
                                "WHERE oi.order.orderStatus = :completedStatus " +
                                "GROUP BY p.productId, p.name " +
                                "ORDER BY SUM(oi.quantity) DESC",
                        Object[].class
                )
                .setParameter("completedStatus", OrderStatus.COMPLETED)
                .setMaxResults(limit)
                .getResultList();
    }

    /**
     * ADMIN: Top x most profitable products
     * Profit = (purchasedPrice - wholesalePrice) * quantity
     * Includes only COMPLETED orders
     * Returns: [productId, productName, totalProfit]
     */
    public List<Object[]> findProfitableProducts(int limit) {
        return getCurrentSession()
                .createQuery(
                        "SELECT p.productId, p.name, " +
                                "SUM((oi.purchasedPrice - oi.wholesalePrice) * oi.quantity) " +
                                "FROM OrderItem oi " +
                                "JOIN oi.product p " +
                                "WHERE oi.order.orderStatus = :completedStatus " +
                                "GROUP BY p.productId, p.name " +
                                "ORDER BY SUM((oi.purchasedPrice - oi.wholesalePrice) * oi.quantity) DESC",
                        Object[].class
                )
                .setParameter("completedStatus", OrderStatus.COMPLETED)
                .setMaxResults(limit)
                .getResultList();
    }
}
