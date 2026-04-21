package shopping.dao;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import shopping.entity.Product;

import java.util.List;
import java.util.Optional;

@Repository
public class ProductDao {

    private final SessionFactory sessionFactory;

    @Autowired
    public ProductDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public Optional<Product> findById(Long productId) {
        Product product = sessionFactory.getCurrentSession().get(Product.class, productId);
        return Optional.ofNullable(product);
    }

    public List<Product> findAll() {
        return sessionFactory.getCurrentSession().createQuery("FROM Product p", Product.class).getResultList();
    }

    public List<Product> findAllInStock() {
        return sessionFactory.getCurrentSession()
                .createQuery("FROM Product p WHERE p.quantity > 0", Product.class)
                .getResultList();
    }

    public Product save(Product product) {
        sessionFactory.getCurrentSession().saveOrUpdate(product);
        return product;
    }
}
