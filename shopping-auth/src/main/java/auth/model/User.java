package auth.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    /**
     * 0 = USER
     * 1 = ADMIN
     */
    @Column(nullable = false)
    private Integer role;

    @Column(nullable = false, unique = true)
    private String username;

    public User(String email, String password, Integer role, String username) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.username = username;
    }
}
