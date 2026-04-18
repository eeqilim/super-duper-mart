package shopping.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import shopping.model.Order;

import java.util.List;
import java.util.Optional;

@Repository
public class OrderDao {

    private final SessionFactory sessionFactory;

    @Autowired
    public OrderDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    public Optional<Order> findById(Long orderId) {
        Order order = getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT o FROM Order o " +
                                "LEFT JOIN FETCH o.orderItems oi " +
                                "LEFT JOIN FETCH oi.product " +
                                "WHERE o.orderId = :orderId",
                        Order.class
                )
                .setParameter("orderId", orderId)
                .uniqueResult();

        return Optional.ofNullable(order);
    }

    public Order save(Order order) {
        sessionFactory.getCurrentSession().saveOrUpdate(order);
        return order;
    }

    public List<Order> findByUserId(Long userId) {
        return getCurrentSession()
                .createQuery(
                        "SELECT DISTINCT o FROM Order o " +
                                "LEFT JOIN FETCH o.orderItems oi " +
                                "LEFT JOIN FETCH oi.product " +
                                "WHERE o.user.userId = :userId " +
                                "ORDER BY o.datePlaced DESC, o.orderId DESC",
                        Order.class
                )
                .setParameter("userId", userId)
                .getResultList();
    }

    public List<Order> findAllForAdmin(int page, int size) {
        return getCurrentSession()
                .createQuery("SELECT o FROM Order o " +
                        "JOIN FETCH o.user " +
                        "ORDER BY o.datePlaced DESC, o.orderId DESC", Order.class)
                .setFirstResult(page * size)
                .setMaxResults(size)
                .getResultList();
    }
}
