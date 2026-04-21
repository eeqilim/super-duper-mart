package shopping.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import shopping.entity.Watchlist;

import java.util.List;
import java.util.Optional;

@Repository
public class WatchlistDao {

    private final SessionFactory sessionFactory;

    @Autowired
    public WatchlistDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    public Optional<Watchlist> findByUserIdAndProductId(Long userId, Long productId) {
        Watchlist w = sessionFactory.getCurrentSession()
                .createQuery(
                        "FROM Watchlist w WHERE w.user.userId = :userId AND w.product.productId = :productId",
                        Watchlist.class)
                .setParameter("userId", userId)
                .setParameter("productId", productId)
                .uniqueResult();

        return Optional.ofNullable(w);
    }

    public void save(Watchlist watchlist) {
        getCurrentSession().saveOrUpdate(watchlist);
    }

    public void delete(Watchlist watchlist) {
        getCurrentSession().delete(watchlist);
    }

    public List<Watchlist> findByUserId(Long userId) {
        return getCurrentSession()
                .createQuery("SELECT w FROM Watchlist w " +
                        "JOIN FETCH w.product p " +
                        "WHERE w.user.userId = :userId " +
                        "ORDER BY p.productId ASC", Watchlist.class)
                .setParameter("userId", userId)
                .getResultList();
    }
}
