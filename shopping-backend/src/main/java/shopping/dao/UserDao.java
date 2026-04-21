package shopping.dao;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import shopping.entity.User;

import java.util.Optional;

@Repository
public class UserDao {

    private final SessionFactory sessionFactory;

    @Autowired
    public UserDao(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public Optional<User> findById(Long userId) {
        User user = sessionFactory.getCurrentSession().find(User.class, userId);
        return Optional.ofNullable(user);
    }
}
