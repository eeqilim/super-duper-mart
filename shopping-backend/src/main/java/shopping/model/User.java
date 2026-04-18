package shopping.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id")
    private Long userId;

    /**
     * 0 = USER, 1 = ADMIN
     */
    @Column(nullable = false)
    private Integer role;

    @Column(name = "username", nullable = false)
    private String username;

    public User(Long userId) {
        this.userId = userId;
    }

    public User(Long userId, Integer role, String username) {
        this.userId = userId;
        this.role = role;
        this.username = username;
    }
}
