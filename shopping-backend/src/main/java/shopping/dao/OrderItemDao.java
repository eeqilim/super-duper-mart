package shopping.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import shopping.model.OrderItem;
import shopping.model.OrderStatus;

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

    public void save(OrderItem orderItem) {
        getCurrentSession().saveOrUpdate(orderItem);
    }

    public void saveAll(List<OrderItem> orderItems) {
        for (OrderItem orderItem : orderItems) {
            getCurrentSession().saveOrUpdate(orderItem);
        }
    }

    public List<OrderItem> findByOrderId(Long orderId) {
        return getCurrentSession()
                .createQuery("SELECT oi FROM OrderItem oi " +
                        "JOIN FETCH oi.product " +
                        "WHERE oi.order.orderId = :orderId " +
                        "ORDER BY oi.itemId ASC", OrderItem.class)
                .setParameter("orderId", orderId)
                .getResultList();
    }

    public List<OrderItem> findRecentPurchasedItems(Long userId, int limit) {
        return getCurrentSession()
                .createQuery("SELECT oi FROM OrderItem oi " +
                        "JOIN FETCH oi.product p " +
                        "JOIN oi.order o " +
                        "WHERE o.user.userId = :userId " +
                        "AND o.orderStatus <> :canceledStatus " +
                        "ORDER BY o.datePlaced DESC, oi.itemId DESC", OrderItem.class)
                .setParameter("userId", userId)
                .setParameter("canceledStatus", OrderStatus.CANCELED)
                .setMaxResults(limit)
                .getResultList();
    }

    public Long getTotalSoldItems() {
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT SUM(oi.quantity) " +
                                "FROM OrderItem oi " +
                                "WHERE oi.order.orderStatus = 'COMPLETED'",
                        Long.class
                )
                .uniqueResult();
    }

    public List<Object[]> getTop3SoldProducts() {
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT oi.product.productId, oi.product.name, SUM(oi.quantity) " +
                                "FROM OrderItem oi " +
                                "WHERE oi.order.orderStatus = 'COMPLETED' " +
                                "GROUP BY oi.product.productId, oi.product.name " +
                                "ORDER BY SUM(oi.quantity) DESC",
                        Object[].class
                )
                .setMaxResults(3)
                .getResultList();
    }

    public Object[] getMostProfitableProduct() {
        return sessionFactory.getCurrentSession()
                .createQuery(
                        "SELECT oi.product.productId, oi.product.name, " +
                                "SUM((oi.purchasedPrice - oi.wholesalePrice) * oi.quantity) " +
                                "FROM OrderItem oi " +
                                "WHERE oi.order.orderStatus = 'COMPLETED' " +
                                "GROUP BY oi.product.productId, oi.product.name " +
                                "ORDER BY SUM((oi.purchasedPrice - oi.wholesalePrice) * oi.quantity) DESC",
                        Object[].class
                )
                .setMaxResults(1)
                .uniqueResult();
    }
}
