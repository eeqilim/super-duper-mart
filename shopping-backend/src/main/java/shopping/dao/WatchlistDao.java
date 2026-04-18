package shopping.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import shopping.model.Watchlist;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
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

    public List<Watchlist> findInStockByUserId(Long userId) {
        CriteriaBuilder cb = getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<Watchlist> cq = cb.createQuery(Watchlist.class);
        Root<Watchlist> root = cq.from(Watchlist.class);

        cq.select(root)
                .where(
                        cb.and(
                                cb.equal(root.get("user").get("userId"), userId),
                                cb.greaterThan(root.get("product").get("quantity"), 0)
                        )
                )
                .orderBy(cb.asc(root.get("product").get("productId")));

        return getCurrentSession()
                .createQuery(cq)
                .getResultList();
    }
}
